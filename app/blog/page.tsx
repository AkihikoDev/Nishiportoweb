import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/date-formatter";
import type { BlogPost } from "@/lib/types";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata = {
  title: "Blog | Nishi Website",
  description: "Read my latest blog posts",
};

export default async function BlogPage() {
  const supabase = getSupabaseServerClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return (
    <div className="container px-4 py-12 mx-auto animate-in">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Blog</h1>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post: BlogPost) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                {post.cover_image_url && (
                  <div className="relative h-48 w-full">
                    <SafeImage
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </p>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.published_at)}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No blog posts found. Add some in the admin panel!
          </p>
        </div>
      )}
    </div>
  );
}
