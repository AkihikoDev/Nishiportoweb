"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileCode,
  FileText,
  MessageSquare,
  LinkIcon,
  LogOut,
  Menu,
} from "lucide-react"

export function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      href: "/admin/profile",
      icon: User,
    },
    {
      title: "Projects",
      href: "/admin/projects",
      icon: Briefcase,
    },
    {
      title: "Skills",
      href: "/admin/skills",
      icon: FileCode,
    },
    {
      title: "Blog Posts",
      href: "/admin/blog",
      icon: FileText,
    },
    {
      title: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      title: "Social Links",
      href: "/admin/social",
      icon: LinkIcon,
    },
  ]

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between p-4 border-b bg-background">
      <div className="font-semibold">Admin Dashboard</div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <div className="px-2 py-6 flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-2 py-1 text-lg ${
                    pathname === item.href ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              ))}
              <div className="h-px bg-border my-2" />
              <button
                onClick={handleSignOut}
                className="flex items-center px-2 py-1 text-lg text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

