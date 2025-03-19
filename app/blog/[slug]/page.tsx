import Image from "next/image"
import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { formatDate } from "@/lib/utils/date-formatter"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt || post.content.substring(0, 150),
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const supabase = getSupabaseServerClient()
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (!post) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 mx-auto animate-in">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground mb-8">{formatDate(post.published_at)}</p>

        {post.cover_image_url && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.cover_image_url || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  )
}

