import { BlogForm } from "../blog-form"

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>
        <p className="text-muted-foreground">Write a new blog post</p>
      </div>

      <BlogForm isNew />
    </div>
  )
}

