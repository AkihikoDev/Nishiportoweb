import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Skill } from "@/lib/types"
import { Plus } from "lucide-react"

export default async function SkillsPage() {
  const supabase = getSupabaseServerClient()

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <Button asChild>
          <Link href="/admin/skills/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Link>
        </Button>
      </div>

      {Object.keys(skillsByCategory).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="space-y-2">
              <h2 className="text-xl font-semibold">{category}</h2>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Proficiency</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categorySkills.map((skill: Skill) => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                        <TableCell>{skill.proficiency}/5</TableCell>
                        <TableCell>{skill.order_index}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/skills/${skill.id}`}>Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
          <p className="mb-4 text-muted-foreground">No skills found</p>
          <Button asChild>
            <Link href="/admin/skills/new">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

