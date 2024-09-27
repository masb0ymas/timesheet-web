import { IconArrowLeft, IconPlus } from "@tabler/icons-react"
import _ from "lodash"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PropsWithChildren } from "react"
import { capitalizeFirstLetter } from "~/lib/string"
import Button from "../ui/button"
import Header from "./header"

type PageProps = PropsWithChildren

export default function Layout(props: PageProps) {
  const pathname = usePathname()

  let title = "Dashboard"
  let prevPath = "/"
  let isActionPath = false

  if (pathname !== "/") {
    const paths = pathname.split("/")
    const firstPath = _.compact(paths)[0]
    prevPath = `/${firstPath}`

    if (pathname.match(/\/add|edit$/)) {
      isActionPath = true
    }

    title = capitalizeFirstLetter(firstPath)
  }

  return (
    <div>
      <Header />

      <header className="bg-white shadow">
        <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

          {pathname !== "/" && !isActionPath ? (
            <Link href={`${pathname}/add`}>
              <Button>
                <IconPlus size={18} stroke={2} />
                <span className="pl-2">Add</span>
              </Button>
            </Link>
          ) : (
            <Link href={prevPath}>
              <Button>
                <IconArrowLeft size={18} stroke={2} />
                <span className="pl-2">Back</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{props.children}</main>
    </div>
  )
}
