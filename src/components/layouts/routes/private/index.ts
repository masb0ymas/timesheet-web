import dynamic from "next/dynamic"

const PrivateContainer = dynamic(() => import("~/components/layouts/containers/private"))

const routes = [
  {
    path: "/dashboard",
    layout: PrivateContainer,
    exact: true,
  },
  {
    path: "/project",
    layout: PrivateContainer,
    exact: true,
  },
  {
    path: "/team",
    layout: PrivateContainer,
    exact: true,
  },
]

const privateRoutes = routes

export default privateRoutes
