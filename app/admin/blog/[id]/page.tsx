import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BlogForm } from "../blog-form"

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
        <p className="text-muted-foreground">Update your blog post</p>
      </div>

      <BlogForm initialData={post} />
    </div>
  )
}

