import React, { PropsWithChildren } from "react";
import Header from "./header";

type PageProps = PropsWithChildren

export default function Layout(props: PageProps) {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
}
