import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProjectForm } from "../project-form"

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single()

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Update your project details</p>
      </div>

      <ProjectForm initialData={project} />
    </div>
  )
}

