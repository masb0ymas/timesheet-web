"use client"

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"
import { IconBell, IconBurger, IconX } from "@tabler/icons-react"
import _ from "lodash"
import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { activePath } from "~/lib/matchPath"

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
}

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Worklog", href: "/worklog" },
  { name: "Project", href: "/project" },
  { name: "Team", href: "/team" },
]

const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const [originURL, setOriginURL] = useState("http://localhost:3000")

  const email = _.get(session, "user.email", "-")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginURL(window.location.origin)
    }
  }, [originURL])

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full top-0 sticky">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-8 w-8"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => {
                      let isActive = false
                      let link = `/auth/login?callbackUrl=${originURL}`

                      if (typeof window !== "undefined" && !_.isNil(pathname)) {
                        isActive = activePath(pathname, item.href)
                      }

                      if (session) {
                        link = item.href
                      }

                      return (
                        <Link
                          href={link}
                          key={item.name}
                          aria-current={isActive ? "page" : undefined}
                          className={classNames(
                            isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                {session ? (
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <IconBell aria-hidden="true" className="h-6 w-6" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                        </MenuButton>
                      </div>
                      <MenuItems
                        transition
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <MenuItem>
                          <Link
                            href={"/profile"}
                            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 font-semibold"
                          >
                            {email.substring(0, 15)}...
                          </Link>
                        </MenuItem>

                        <hr className="my-0 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

                        {userNavigation.map((item) => (
                          <MenuItem key={item.name}>
                            <Link
                              href={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                              {item.name}
                            </Link>
                          </MenuItem>
                        ))}

                        <MenuItem>
                          <button
                            onClick={() => signOut({ callbackUrl: originURL })}
                            className="flex justify-start px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 w-full"
                          >
                            Sign out
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                ) : (
                  <Button onClick={() => signIn()} fullWidth>
                    Login
                  </Button>
                )}
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <IconBurger
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <IconX aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => {
                let isActive = false
                let link = `/auth/login?callbackUrl=${originURL}`

                if (typeof window !== "undefined" && !_.isNil(pathname)) {
                  isActive = activePath(pathname, item.href)
                }

                if (session) {
                  link = item.href
                }

                return (
                  <Link href={link} key={item.name}>
                    <DisclosureButton
                      as="a"
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </DisclosureButton>
                  </Link>
                )
              })}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img alt="" src={user.imageUrl} className="h-10 w-10 rounded-full" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">{user.name}</div>
                  <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <IconBell aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Link href={item.href} key={item.name}>
                    <DisclosureButton
                      as="a"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </DisclosureButton>
                  </Link>
                ))}
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </>
  )
}
