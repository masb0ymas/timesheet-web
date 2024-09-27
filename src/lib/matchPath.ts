import _ from "lodash"

/**
 *
 * @param pathname
 * @param link
 * @returns
 */
export function matchPath(pathname: string, link: string) {
  const matchPath = pathname.match(link)
  let isActive = false

  if (link !== "/" && !_.isEmpty(matchPath)) {
    isActive = true
  }

  if (link === "/" && pathname === "/") {
    isActive = true
  }

  return isActive
}
