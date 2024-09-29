import dynamic from "next/dynamic"

const PublicContainer = dynamic(() => import("~/components/layouts/containers"))

const routes = [
  {
    path: "/",
    layout: PublicContainer,
    exact: true,
  },
  {
    path: "/project",
    layout: PublicContainer,
    exact: true,
  },
  {
    path: "/team",
    layout: PublicContainer,
    exact: true,
  },
]

const homeRoutes = routes

export default homeRoutes
