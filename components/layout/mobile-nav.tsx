"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface MobileNavProps {
  isLoggedIn: boolean
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/projects",
      label: "Projects",
    },
    {
      href: "/blog",
      label: "Blog",
    },
    {
      href: "/contact",
      label: "Contact",
    },
  ]

  const adminRoutes = [
    {
      href: "/admin",
      label: "Admin Dashboard",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-2 py-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`px-2 py-1 text-lg ${
                  pathname === route.href ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
            {isLoggedIn && (
              <>
                <div className="h-px bg-border my-2" />
                {adminRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`px-2 py-1 text-lg ${
                      pathname === route.href
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

