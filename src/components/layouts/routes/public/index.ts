import dynamic from "next/dynamic"

const PublicContainer = dynamic(() => import("~/components/layouts/containers/public"))

const routes = [
  {
    path: "/",
    layout: PublicContainer,
    exact: true,
  },
]

const publicRoutes = routes

export default publicRoutes
