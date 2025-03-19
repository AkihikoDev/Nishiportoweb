import { SkillForm } from "../skill-form"

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Skill</h1>
        <p className="text-muted-foreground">Add a new skill to your profile</p>
      </div>

      <SkillForm isNew />
    </div>
  )
}

