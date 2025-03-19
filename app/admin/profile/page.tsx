import { ProfileForm } from "./profile-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function ProfilePage() {
  const supabase = getSupabaseServerClient()

  const { data: profile } = await supabase.from("profiles").select("*").limit(1).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <ProfileForm initialData={profile || undefined} />
    </div>
  )
}

