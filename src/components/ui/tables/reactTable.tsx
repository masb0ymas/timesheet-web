"use client"

import { IconEdit, IconTrash } from "@tabler/icons-react"
import { QueryObserverBaseResult, useMutation } from "@tanstack/react-query"
import {
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import _ from "lodash"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { Button } from "../button"

type Query = QueryObserverBaseResult & {
  data: any[]
  total: number
}

type ReactTableProps<T> = ReturnType<typeof useReactTable<T>>

interface IProps<T> extends Partial<ReactTableProps<T>> {
  baseURL: string
  query: Query
  columns: ColumnDef<T, any>[]
  mutation?: ReturnType<typeof useMutation<any, any, any, any>>
  isEdit?: boolean
  isDelete?: boolean
}

export default function Table<T>(props: IProps<T>) {
  const { query, columns, mutation, baseURL, isEdit, isDelete } = props
  const router = useRouter()

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [visible, setVisible] = useState(false)

  const { data, isLoading, isFetching } = query

  async function handleDelete(id: string) {
    setVisible(true)

    try {
      await mutation?.mutateAsync(id)
    } catch (error) {
      console.log(error)
    }

    setVisible(false)
  }

  const defaultColumns: ColumnDef<T, any>[] = [
    ...columns,
    {
      accessorKey: "actions",
      id: "actions",
      header: "Actions",
      enablePinning: true,
      cell: ({ row }) => {
        const id = _.get(row.original, "id") as string

        return (
          <div className="flex items-center justify-center gap-2">
            {isEdit && (
              <Button variant="ghost" onClick={() => router.push(`${baseURL}/${id}/edit`)}>
                <IconEdit />
              </Button>
            )}

            {isDelete && (
              <Button
                variant={visible ? "default" : "ghost"}
                onClick={() => handleDelete(id)}
                disabled={visible}
                loading={visible}
              >
                {!visible && <IconTrash />}
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const newColumns = useMemo(() => {
    if (!isEdit && !isDelete) {
      return [...columns]
    }

    return defaultColumns
  }, [isEdit, isDelete])

  const columnOrder = useMemo<ColumnOrderState>(
    () => newColumns.map((column) => column.id as string),
    [newColumns]
  )

  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "index",
        id: "index",
        enablePinning: true,
        header: "#",
        cell: ({ row }) => (
          <span className="items-center">
            {row.index + 1 + ((page ?? 1) - 1) * (pageSize ?? 10)}
          </span>
        ),
      },
      ...newColumns,
    ],
    state: {
      columnOrder: ["select", "index", ...columnOrder],
    },
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="block w-full overflow-x-auto">
      <table className="table-auto items-center bg-transparent w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 text-center bg-slate-100 text-slate-900 align-middle border border-solid border-slate-200 py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {(isLoading || isFetching) && (
            <tr>
              <td colSpan={columns.length + 1} className="flex justify-center items-center">
                Loading...
              </td>
            </tr>
          )}

          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const defaultAccesssor = ["index", "actions"]

                let width = undefined
                if (defaultAccesssor.includes(cell.column.id)) {
                  width = 100
                }

                return (
                  <td
                    key={cell.id}
                    width={width}
                    className="text-center border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
