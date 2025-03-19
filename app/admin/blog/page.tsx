import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils/date-formatter"
import { Plus } from "lucide-react"

export default async function BlogPostsPage() {
  const supabase = getSupabaseServerClient()

  const { data: posts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Link>
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: BlogPost) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                  </TableCell>
                  <TableCell>{post.published_at ? formatDate(post.published_at) : "Not published"}</TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <p className="mb-4 text-muted-foreground">No blog posts found</p>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Post
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

