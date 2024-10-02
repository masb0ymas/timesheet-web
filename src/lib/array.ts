import { formatDate } from "date-fns"

/**
 *
 * @param data
 * @param key - key to group by Date
 * @returns
 */
export function groupBy(data: any[], key: string) {
  const groups = data.reduce((acc: any, curValue: any) => {
    const date = formatDate(curValue[key], "yyyy-MM-dd")

    if (!acc[date]) {
      acc[date] = []
    }

    acc[date].push(curValue)
    return acc
  }, {})

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      [key]: date,
      data: groups[date],
    }
  })

  return groupArrays
}
