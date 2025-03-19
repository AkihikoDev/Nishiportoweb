import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SocialLink } from "@/lib/types"
import { Plus } from "lucide-react"

export default async function SocialLinksPage() {
  const supabase = getSupabaseServerClient()

  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .order("order_index", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
        <Button asChild>
          <Link href="/admin/social/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Link>
        </Button>
      </div>

      {socialLinks && socialLinks.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.map((social: SocialLink) => (
                <TableRow key={social.id}>
                  <TableCell className="font-medium">{social.platform}</TableCell>
                  <TableCell className="truncate max-w-[300px]">
                    <a href={social.url} target="_blank" rel="noreferrer" className="hover:underline">
                      {social.url}
                    </a>
                  </TableCell>
                  <TableCell>{social.order_index}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/social/${social.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <p className="mb-4 text-muted-foreground">No social links found</p>
          <Button asChild>
            <Link href="/admin/social/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Social Link
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

