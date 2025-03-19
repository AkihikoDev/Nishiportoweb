import { SocialForm } from "../social-form"

export default function NewSocialLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Social Link</h1>
        <p className="text-muted-foreground">Add a new social media link to your profile</p>
      </div>

      <SocialForm isNew />
    </div>
  )
}

