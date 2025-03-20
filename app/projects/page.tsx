import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Project } from "@/lib/types"
// Import the SafeImage component at the top of the file
import { SafeImage } from "@/components/ui/safe-image"

export const metadata = {
  title: "Projects | Personal Branding Website",
  description: "View my portfolio of projects",
}

export default async function ProjectsPage() {
  const supabase = getSupabaseServerClient()

  const { data: projects } = await supabase.from("projects").select("*").order("order_index", { ascending: true })

  return (
    <div className="container px-4 py-12 mx-auto animate-in">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Projects</h1>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <Card key={project.id} className="overflow-hidden transition-all hover:shadow-md">
              {project.image_url && (
                <div className="relative h-48 w-full">
                  <SafeImage src={project.image_url} alt={project.title} fill className="object-cover" />
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
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects found. Add some in the admin panel!</p>
        </div>
      )}
    </div>
  )
}

