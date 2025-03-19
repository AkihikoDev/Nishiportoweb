"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface DeleteMessageProps {
  id: string
}

export function DeleteMessage({ id }: DeleteMessageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("messages").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Message deleted",
      })

      router.push("/admin/messages")
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
    <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
      {isLoading ? "Deleting..." : "Delete Message"}
    </Button>
  )
}

