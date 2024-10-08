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
  },
  {
    path: "/team",
    layout: PrivateContainer,
  },
  {
    path: "/worklog",
    layout: PrivateContainer,
  },
]

const privateRoutes = routes

export default privateRoutes
