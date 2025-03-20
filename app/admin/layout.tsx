import type React from "react"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AdminSidebar } from "./admin-sidebar"
import { AdminMobileNav } from "./admin-mobile-nav"

export const metadata = {
  title: "Admin Dashboard | Personal Branding Website",
  description: "Manage your personal branding website content",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <div className="md:hidden">
        <AdminMobileNav />
      </div>
      <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  )
}

