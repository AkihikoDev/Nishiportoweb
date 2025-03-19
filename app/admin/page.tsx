import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FileCode, FileText, MessageSquare, User, LinkIcon } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = getSupabaseServerClient()

  // Get counts for dashboard
  const [
    { count: projectCount },
    { count: skillCount },
    { count: blogCount },
    { count: messageCount },
    { count: socialCount },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("social_links").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*").limit(1).single(),
  ])

  const hasProfile = !!profiles

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your personal branding website content</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hasProfile ? "Complete" : "Incomplete"}</div>
            <p className="text-xs text-muted-foreground">
              {hasProfile ? "Your profile is set up" : "Set up your profile"}
            </p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/profile">Manage Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCount || 0}</div>
            <p className="text-xs text-muted-foreground">{projectCount ? "Projects added" : "No projects yet"}</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <FileCode className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillCount || 0}</div>
            <p className="text-xs text-muted-foreground">{skillCount ? "Skills added" : "No skills yet"}</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/skills">Manage Skills</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogCount || 0}</div>
            <p className="text-xs text-muted-foreground">{blogCount ? "Blog posts added" : "No blog posts yet"}</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/blog">Manage Blog Posts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messageCount || 0}</div>
            <p className="text-xs text-muted-foreground">{messageCount ? "Messages received" : "No messages yet"}</p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Social Links</CardTitle>
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {socialCount ? "Social links added" : "No social links yet"}
            </p>
            <Button asChild className="w-full mt-4" variant="outline">
              <Link href="/admin/social">Manage Social Links</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Follow these steps to set up your personal branding website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Set up your profile</p>
                <p className="text-sm text-muted-foreground">Add your name, title, bio, and contact information</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Add your projects</p>
                <p className="text-sm text-muted-foreground">Showcase your work with images and descriptions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">List your skills</p>
                <p className="text-sm text-muted-foreground">Highlight your expertise and proficiency levels</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold">4</span>
              </div>
              <div>
                <p className="font-medium">Add social links</p>
                <p className="text-sm text-muted-foreground">Connect your social media profiles</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-bold">5</span>
              </div>
              <div>
                <p className="font-medium">Write blog posts</p>
                <p className="text-sm text-muted-foreground">Share your thoughts and expertise</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Your Website</CardTitle>
            <CardDescription>Check how your website looks to visitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your changes are automatically reflected on your public website. Visit the pages below to see how they
              look:
            </p>

            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/" target="_blank">
                  <User className="w-4 h-4 mr-2" />
                  Home Page
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/projects" target="_blank">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Projects Page
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/blog" target="_blank">
                  <FileText className="w-4 h-4 mr-2" />
                  Blog Page
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/contact" target="_blank">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Page
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

