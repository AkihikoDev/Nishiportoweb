import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { SocialLink } from "@/lib/types"

export async function SiteFooter() {
  const supabase = getSupabaseServerClient()
  const { data: socialLinks } = await supabase
    .from("social_links")
    .select("*")
    .order("order_index", { ascending: true })

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Personal Brand. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks?.map((social: SocialLink) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              {social.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

