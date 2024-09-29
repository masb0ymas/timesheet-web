import privateRoutes from "./private"
import publicRoutes from "./public"

// @ts-expect-error
export const globalRoutes = [].concat(publicRoutes, privateRoutes)
