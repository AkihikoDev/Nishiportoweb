"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

// Add these imports at the top
import { isValidImageUrl, getSafeImageUrl } from "@/lib/utils/image-validator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface ProjectFormProps {
  initialData?: Project
  isNew?: boolean
}

export function ProjectForm({ initialData, isNew = false }: ProjectFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Then add these state variables in the component
  const [validatingImage, setValidatingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image_url || null)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    project_url: initialData?.project_url || "",
    github_url: initialData?.github_url || "",
    order_index: initialData?.order_index || 0,
    is_featured: initialData?.is_featured || false,
  })

  // Add this function to validate the image URL
  const validateImageUrl = async () => {
    if (!formData.image_url) {
      setPreviewImage(null)
      return
    }

    setValidatingImage(true)
    setImageError(null)

    try {
      const isValid = await isValidImageUrl(formData.image_url)

      if (isValid) {
        setPreviewImage(formData.image_url)
      } else {
        setImageError("The provided URL is not a valid image. Please enter a direct link to an image file.")
        setPreviewImage(null)
      }
    } catch (error) {
      setImageError("Failed to validate image URL. Please check the URL and try again.")
      setPreviewImage(null)
    } finally {
      setValidatingImage(false)
    }
  }

  // Update the handleChange function to clear image error
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear image error when image_url is changed
    if (name === "image_url") {
      setImageError(null)
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_featured: checked }))
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
        // Create new project
        const { error } = await supabase.from("projects").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error

        toast({
          title: "Project created",
          description: "Your project has been created successfully.",
        })

        router.push("/admin/projects")
      } else if (initialData?.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
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
    if (!initialData?.id || !window.confirm("Are you sure you want to delete this project?")) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("projects").delete().eq("id", initialData.id)

      if (error) throw error

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      })

      router.push("/admin/projects")
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
          <CardTitle>{isNew ? "Add Project" : "Edit Project"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          {/* Update the image URL input field in the form */}
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={validateImageUrl}
                disabled={validatingImage || !formData.image_url}
              >
                {validatingImage ? "Checking..." : "Test URL"}
              </Button>
            </div>
            {imageError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{imageError}</AlertDescription>
              </Alert>
            )}
            {previewImage && (
              <div className="mt-4">
                <div className="relative h-40 w-full rounded-md overflow-hidden border border-muted">
                  <Image
                    src={getSafeImageUrl(previewImage) || "/placeholder.svg"}
                    alt="Image preview"
                    fill
                    className="object-cover"
                    onError={() => {
                      setImageError("Failed to load image. Please check the URL and try again.")
                      setPreviewImage(null)
                    }}
                  />
                </div>
              </div>
            )}
            <p className="text-sm text-muted-foreground">Use a direct link to an image file (JPG, PNG, WebP).</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_url">Project URL</Label>
            <Input
              id="project_url"
              name="project_url"
              value={formData.project_url || ""}
              onChange={handleChange}
              placeholder="https://example.com/project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub URL</Label>
            <Input
              id="github_url"
              name="github_url"
              value={formData.github_url || ""}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
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

          <div className="flex items-center space-x-2">
            <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_featured">Featured Project</Label>
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
              onClick={() => router.push("/admin/projects")}
              disabled={isLoading || isDeleting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

