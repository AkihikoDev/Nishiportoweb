import { ContactForm } from "./contact-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types"

export const metadata = {
  title: "Contact | Personal Branding Website",
  description: "Get in touch with me",
}

export default async function ContactPage() {
  const supabase = getSupabaseServerClient()

  const { data: profiles } = await supabase.from("profiles").select("*").limit(1).single()

  const profile: Profile = profiles || {
    id: "",
    name: "Your Name",
    title: "Your Title",
    bio: "Your bio will appear here once you add it in the admin panel.",
    avatar_url: null,
    resume_url: null,
    email: null,
    location: null,
    created_at: "",
    updated_at: "",
  }

  return (
    <div className="container px-4 py-12 mx-auto animate-in">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Contact Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-lg mb-6">
            I'd love to hear from you! Fill out the form and I'll get back to you as soon as possible.
          </p>

          {profile.email && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          )}

          {profile.location && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">{profile.location}</p>
            </div>
          )}
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

