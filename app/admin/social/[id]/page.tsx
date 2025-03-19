import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SocialForm } from "../social-form"

export default async function EditSocialLinkPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: socialLink } = await supabase.from("social_links").select("*").eq("id", params.id).single()

  if (!socialLink) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Social Link</h1>
        <p className="text-muted-foreground">Update your social media link</p>
      </div>

      <SocialForm initialData={socialLink} />
    </div>
  )
}

