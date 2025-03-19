"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { SocialLink } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface SocialFormProps {
  initialData?: SocialLink
  isNew?: boolean
}

export function SocialForm({ initialData, isNew = false }: SocialFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    platform: initialData?.platform || "",
    url: initialData?.url || "",
    icon: initialData?.icon || "",
    order_index: initialData?.order_index || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      if (isNew) {
        // Create new social link
        const { error } = await supabase.from("social_links").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error

        toast({
          title: "Social link created",
          description: "Your social link has been created successfully.",
        })

        router.push("/admin/social")
      } else if (initialData?.id) {
        // Update existing social link
        const { error } = await supabase
          .from("social_links")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Social link updated",
          description: "Your social link has been updated successfully.",
        })
      }

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

  const handleDelete = async () => {
    if (!initialData?.id || !window.confirm("Are you sure you want to delete this social link?")) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("social_links").delete().eq("id", initialData.id)

      if (error) throw error

      toast({
        title: "Social link deleted",
        description: "Your social link has been deleted successfully.",
      })

      router.push("/admin/social")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Add Social Link" : "Edit Social Link"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
              placeholder="e.g., Twitter, GitHub, LinkedIn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://example.com/profile"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (optional)</Label>
            <Input id="icon" name="icon" value={formData.icon || ""} onChange={handleChange} placeholder="twitter" />
            <p className="text-sm text-muted-foreground">
              Icon name from Lucide icons (e.g., twitter, github, linkedin)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Display Order</Label>
            <Input
              id="order_index"
              name="order_index"
              type="number"
              value={formData.order_index}
              onChange={handleNumberChange}
              min={0}
            />
            <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isNew && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/social")}
              disabled={isLoading || isDeleting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading ? "Saving..." : "Save Social Link"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

