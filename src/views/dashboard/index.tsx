import React from "react"
import useDashboard from "~/data/query/dashboard/useDashboard"

export default function DashboardPage() {
  const { data, isLoading, isFetching } = useDashboard()

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.length > 0 ? (
        data.map((item) => {
          return (
            <div className="border-2 rounded-xl p-6" key={item.name}>
              <div className="flex justify-between items-center">
                <h2 className="text-lg underline">{item.name}</h2>

                <span className="text-lg font-semibold">
                  {item.limit > 0 ? `${item.value}/${item.limit}` : item.value}
                </span>
              </div>
            </div>
          )
        })
      ) : (
        <div>No data</div>
      )}
    </div>
  )
}
