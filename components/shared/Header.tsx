"use client"

import { useState, useEffect } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"
import NotificationDropdown from "./NotificationDropdown"

const Header = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // hoặc return một skeleton/loading state
  }

  return (
    <header className="w-full border-b bg-violet-400 py-8">
      <div className="wrapper flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-36">
            <Image 
              src="/assets/images/logo1.svg" width={128} height={38}
              alt="Evently logo" 
            />
          </Link>

          <SignedIn>
            <nav className="hidden md:flex items-center gap-4">
              <NotificationDropdown />
              <NavItems />
            </nav>
          </SignedIn>
        </div>

        <div className="flex items-center gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">
                Đăng nhập
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header
