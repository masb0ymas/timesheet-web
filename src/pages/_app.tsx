import "~/styles/globals.css"

import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import getSiteLayout from "~/components/layouts/core"
import Head from "next/head"

export default function App({ Component, pageProps, router }: AppProps) {
  const siteLayout = getSiteLayout({ Component, pageProps, router })

  return (
    <>
      <Head>
        <title>Timesheet</title>
        <meta name="description" content="Timesheet" />
      </Head>
      <SessionProvider session={pageProps.session}>{siteLayout}</SessionProvider>
    </>
  )
}
