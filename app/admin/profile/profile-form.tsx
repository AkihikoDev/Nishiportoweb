"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isValidImageUrl, getSafeImageUrl } from "@/lib/utils/image-validator"
import type { Profile } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface ProfileFormProps {
  initialData?: Profile
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [validatingImage, setValidatingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.avatar_url || null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    avatar_url: initialData?.avatar_url || "",
    resume_url: initialData?.resume_url || "",
    email: initialData?.email || "",
    location: initialData?.location || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear image error when avatar_url is changed
    if (name === "avatar_url") {
      setImageError(null)
    }
  }

  // Validate image URL when avatar_url changes
  const validateImageUrl = async () => {
    if (!formData.avatar_url) {
      setPreviewImage(null)
      return
    }

    setValidatingImage(true)
    setImageError(null)

    try {
      const isValid = await isValidImageUrl(formData.avatar_url)

      if (isValid) {
        setPreviewImage(formData.avatar_url)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate image URL before saving
    if (formData.avatar_url) {
      const isValid = await isValidImageUrl(formData.avatar_url)
      if (!isValid) {
        setImageError("The provided URL is not a valid image. Please enter a direct link to an image file.")
        setIsLoading(false)
        return
      }
    }

    try {
      const supabase = getSupabaseBrowserClient()

      if (initialData?.id) {
        // Update existing profile
        const { error } = await supabase
          .from("profiles")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        // Create new profile
        const { error } = await supabase.from("profiles").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error
      }

      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title/Position</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            <p className="text-sm text-muted-foreground">E.g., "Full Stack Developer" or "UX Designer"</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={6} required />
            <p className="text-sm text-muted-foreground">Supports Markdown formatting</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <div className="flex gap-2">
              <Input
                id="avatar_url"
                name="avatar_url"
                value={formData.avatar_url || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={validateImageUrl}
                disabled={validatingImage || !formData.avatar_url}
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
              <div className="mt-4 flex justify-center">
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-muted">
                  <Image
                    src={getSafeImageUrl(previewImage) || "/placeholder.svg"}
                    alt="Avatar preview"
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
            <p className="text-sm text-muted-foreground">
              Use a direct link to an image file (JPG, PNG, WebP). For best results, use a square image.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume_url">Resume URL</Label>
            <Input
              id="resume_url"
              name="resume_url"
              value={formData.resume_url || ""}
              onChange={handleChange}
              placeholder="https://example.com/resume.pdf"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || validatingImage}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

