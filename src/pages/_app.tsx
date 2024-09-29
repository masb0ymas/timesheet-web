import "~/styles/globals.css"

import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import getSiteLayout from "~/components/layouts/core"

export default function App({ Component, pageProps, router }: AppProps) {
  const siteLayout = getSiteLayout({ Component, pageProps, router })

  return <SessionProvider session={pageProps.session}>{siteLayout}</SessionProvider>
}
