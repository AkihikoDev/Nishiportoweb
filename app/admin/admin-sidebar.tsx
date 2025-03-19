"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { LayoutDashboard, User, Briefcase, FileCode, FileText, MessageSquare, LinkIcon, LogOut } from "lucide-react"

export function AdminSidebar() {
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
    <div className="border-r bg-muted/40 h-full">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
        <div className="p-6">
          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

