import "~/styles/globals.css";

import type { AppProps } from "next/app";
import React from "react";
import Layout from "~/components/layouts";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Timesheet</title>
        <meta name="description" content="Timesheet" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </React.Fragment>
  );
}
