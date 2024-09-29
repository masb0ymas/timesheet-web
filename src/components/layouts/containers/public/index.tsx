import { ReactComponentLike } from "prop-types"
import React, { useState } from "react"
import Loader from "~/components/ui/loader"
import Header from "../header"

interface IProps {
  Component: ReactComponentLike
}

interface PublicContextProps {
  stateLayoutLoading: [boolean, (loading: boolean) => void]
}

const PublicContext = React.createContext<PublicContextProps>({
  stateLayoutLoading: [false, () => {}],
})

export default function PublicContainer(props: IProps) {
  const { Component } = props

  const stateLayoutLoading = useState(false)
  const [isStateLayoutLoading] = stateLayoutLoading

  return (
    <PublicContext.Provider value={{ stateLayoutLoading }}>
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Loading Component */}
          {isStateLayoutLoading && <Loader />}

          <Component {...props} />
        </main>
      </div>
    </PublicContext.Provider>
  )
}
