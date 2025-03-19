import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SkillForm } from "../skill-form"

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: skill } = await supabase.from("skills").select("*").eq("id", params.id).single()

  if (!skill) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Skill</h1>
        <p className="text-muted-foreground">Update your skill details</p>
      </div>

      <SkillForm initialData={skill} />
    </div>
  )
}

