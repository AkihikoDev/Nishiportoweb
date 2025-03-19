"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface MarkAsReadProps {
  id: string
}

export function MarkAsRead({ id }: MarkAsReadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMarkAsRead = async () => {
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("messages").update({ read: true }).eq("id", id)

      if (error) throw error

      toast({
        title: "Message marked as read",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleMarkAsRead} disabled={isLoading}>
      {isLoading ? "Updating..." : "Mark as Read"}
    </Button>
  )
}

