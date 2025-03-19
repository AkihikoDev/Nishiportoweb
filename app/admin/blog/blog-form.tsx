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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { BlogPost } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

interface BlogFormProps {
  initialData?: BlogPost
  isNew?: boolean
}

export function BlogForm({ initialData, isNew = false }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    cover_image_url: initialData?.cover_image_url || "",
    published: initialData?.published || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generate slug from title if this is a new post and slug field hasn't been manually edited
    if (isNew && name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const now = new Date().toISOString()

      // Set published_at date if publishing for the first time
      const published_at =
        formData.published && (!initialData?.published || !initialData?.published_at)
          ? now
          : initialData?.published_at || null

      if (isNew) {
        // Create new blog post
        const { error } = await supabase.from("blog_posts").insert([
          {
            ...formData,
            published_at,
            created_at: now,
            updated_at: now,
          },
        ])

        if (error) throw error

        toast({
          title: "Blog post created",
          description: "Your blog post has been created successfully.",
        })

        router.push("/admin/blog")
      } else if (initialData?.id) {
        // Update existing blog post
        const { error } = await supabase
          .from("blog_posts")
          .update({
            ...formData,
            published_at,
            updated_at: now,
          })
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Blog post updated",
          description: "Your blog post has been updated successfully.",
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
    if (!initialData?.id || !window.confirm("Are you sure you want to delete this blog post?")) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("blog_posts").delete().eq("id", initialData.id)

      if (error) throw error

      toast({
        title: "Blog post deleted",
        description: "Your blog post has been deleted successfully.",
      })

      router.push("/admin/blog")
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
          <CardTitle>{isNew ? "Create Blog Post" : "Edit Blog Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="your-post-title"
            />
            <p className="text-sm text-muted-foreground">This will be used in the URL: /blog/your-post-title</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleChange}
              rows={2}
              placeholder="A brief summary of your post"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url">Cover Image URL</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              value={formData.cover_image_url || ""}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Tabs defaultValue="write">
              <TabsList className="mb-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  required
                  placeholder="Write your post content here... Markdown is supported"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                  {formData.content ? (
                    <MarkdownRenderer content={formData.content} />
                  ) : (
                    <p className="text-muted-foreground">Nothing to preview</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            <p className="text-sm text-muted-foreground">Supports Markdown formatting</p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="published">Published</Label>
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
              onClick={() => router.push("/admin/blog")}
              disabled={isLoading || isDeleting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

