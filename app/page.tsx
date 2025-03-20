import Image from "next/image"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import type { Profile, Project, Skill } from "@/lib/types"

// Import the getSafeImageUrl function at the top of the file
import { getSafeImageUrl } from "@/lib/utils/image-validator"

export default async function HomePage() {
  const supabase = getSupabaseServerClient()

  // Fetch profile data
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

  // Fetch featured projects
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("order_index", { ascending: true })
    .limit(3)

  // Fetch skills
  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("order_index", { ascending: true })

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {}
  skills?.forEach((skill: Skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = []
    }
    skillsByCategory[skill.category].push(skill)
  })

  return (
    <div className="container px-4 py-12 mx-auto animate-in">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 py-12">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-xl text-muted-foreground">{profile.title}</p>
          <div className="prose dark:prose-invert mx-auto md:mx-0">
            <MarkdownRenderer content={profile.bio} />
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-4">
            <Link href="/projects">
              <Button>View Projects</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Me</Button>
            </Link>
            {profile.resume_url && (
              <Link href={profile.resume_url} target="_blank">
                <Button variant="ghost">Download Resume</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={getSafeImageUrl(profile.avatar_url) || "/placeholder.svg"}
              alt={profile.name}
              width={200}
              height={200}
              className="rounded-full border-4 border-primary/20 shadow-lg md:w-[300px] md:h-[300px]"
              priority
            />
          ) : (
            <div className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">{profile.name.charAt(0)}</span>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
                {project.image_url && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.project_url && (
                      <Link href={project.project_url} target="_blank">
                        <Button size="sm" variant="outline">
                          View Project
                        </Button>
                      </Link>
                    )}
                    {project.github_url && (
                      <Link href={project.github_url} target="_blank">
                        <Button size="sm" variant="ghost">
                          GitHub
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/projects">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section className="py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category} className="cute-gradient p-6">
                <h3 className="text-xl font-bold mb-4">{category}</h3>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{skill.name}</span>
                        <span className="text-muted-foreground">{skill.proficiency}/5</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

