import { AppProps } from "next/app"
import React from "react"
import { globalRoutes } from "../routes"
import { matchPath } from "~/lib/matchPath"

interface IProps {
  exact: boolean
  path: string
  layout: React.Component
}

export const DefaultLayoutContext = React.createContext<IProps & any>({
  exact: undefined,
  path: undefined,
  layout: undefined,
})

export default function getSiteLayout(props: AppProps) {
  const { Component, pageProps, router } = props
  const route = router.route

  const routes: any[] = globalRoutes

  for (let i = 0; i < routes.length; i += 1) {
    const curRoute = routes[i]

    const { exact, path, layout: PageLayout, ...layoutProps } = curRoute
    const match = matchPath(route, { path, exact })

    if (match) {
      return (
        <DefaultLayoutContext.Provider value={curRoute}>
          {PageLayout ? (
            <PageLayout {...props} layoutProps={layoutProps} />
          ) : (
            <Component {...pageProps} key={router.route} />
          )}
        </DefaultLayoutContext.Provider>
      )
    }
  }

  return (
    <DefaultLayoutContext.Provider value={pageProps}>
      {<Component {...pageProps} key={router.route} />}
    </DefaultLayoutContext.Provider>
  )
}
