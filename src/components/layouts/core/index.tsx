import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AppProps } from "next/app"
import React from "react"
import { matchPath } from "~/lib/matchPath"
import { globalRoutes } from "../routes"

interface IProps {
  exact: boolean
  path: string
  layout: React.Component
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
})

function WrapperReactQuery(props: any) {
  const { children } = props

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen position="right" />
    </QueryClientProvider>
  )
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
          <WrapperReactQuery>
            {PageLayout ? (
              <PageLayout {...props} layoutProps={layoutProps} />
            ) : (
              <Component {...pageProps} key={router.route} />
            )}
          </WrapperReactQuery>
        </DefaultLayoutContext.Provider>
      )
    }
  }

  return (
    <DefaultLayoutContext.Provider value={pageProps}>
      <WrapperReactQuery>
        <Component {...pageProps} key={router.route} />
      </WrapperReactQuery>
    </DefaultLayoutContext.Provider>
  )
}
