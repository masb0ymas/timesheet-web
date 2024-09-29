import { IconArrowLeft, IconPlus } from "@tabler/icons-react"
import _ from "lodash"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Router from "next/router"
import { ReactComponentLike } from "prop-types"
import React, { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import Loader from "~/components/ui/loader"
import { capitalizeFirstLetter } from "~/lib/string"
import Header from "../header"

interface IProps {
  Component: ReactComponentLike
}

interface PrivateContextProps {
  stateLayoutLoading: [boolean, (loading: boolean) => void]
}

const PrivateContext = React.createContext<PrivateContextProps>({
  stateLayoutLoading: [false, () => {}],
})

export default function PrivateContainer(props: IProps) {
  const { Component } = props

  const stateLayoutLoading = useState(false)
  const [isStateLayoutLoading] = stateLayoutLoading

  const pathname = usePathname()
  const { data: session, status } = useSession()

  console.log(session)

  useEffect(() => {
    if (_.isEmpty(session) && status != "loading") {
      Router.push("/")
    }

    return
  }, [session, status])

  let title = "Dashboard"
  let prevPath = "/"
  let isActionPath = false

  if (pathname !== "/") {
    const paths = pathname.split("/")
    const firstPath = _.compact(paths)[0]
    prevPath = `/${firstPath}`

    if (pathname.match(/\/add|edit$/)) {
      isActionPath = true
    }

    title = capitalizeFirstLetter(firstPath)
  }

  const excludePath = ["/", "/dashboard"]

  function renderButton() {
    // exclude path
    if (!excludePath.includes(pathname)) {
      // if not action path
      if (!isActionPath) {
        return (
          <Link href={`${pathname}/add`}>
            <Button>
              <IconPlus size={18} stroke={2} />
              <span className="pl-2">Add</span>
            </Button>
          </Link>
        )
      }

      return (
        <Link href={prevPath}>
          <Button variant="outline">
            <IconArrowLeft size={18} stroke={2} />
            <span className="pl-2">Back</span>
          </Button>
        </Link>
      )
    }
  }

  return (
    <PrivateContext.Provider value={{ stateLayoutLoading }}>
      <div>
        <Header />

        {pathname !== "/" && (
          <header className="bg-white shadow">
            <div className="flex justify-between items-center mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>

              {renderButton()}
            </div>
          </header>
        )}

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Loading Component */}
          {isStateLayoutLoading && <Loader />}

          <Component {...props} />
        </main>
      </div>
    </PrivateContext.Provider>
  )
}
