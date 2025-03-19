import { ProjectForm } from "../project-form"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Project</h1>
        <p className="text-muted-foreground">Add a new project to your portfolio</p>
      </div>

      <ProjectForm isNew />
    </div>
  )
}

