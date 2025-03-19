"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Skill } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

interface SkillFormProps {
  initialData?: Skill
  isNew?: boolean
}

export function SkillForm({ initialData, isNew = false }: SkillFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    proficiency: initialData?.proficiency || 3,
    order_index: initialData?.order_index || 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, proficiency: value[0] }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      if (isNew) {
        // Create new skill
        const { error } = await supabase.from("skills").insert([
          {
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error

        toast({
          title: "Skill created",
          description: "Your skill has been created successfully.",
        })

        router.push("/admin/skills")
      } else if (initialData?.id) {
        // Update existing skill
        const { error } = await supabase
          .from("skills")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id)

        if (error) throw error

        toast({
          title: "Skill updated",
          description: "Your skill has been updated successfully.",
        })
      }

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id || !window.confirm("Are you sure you want to delete this skill?")) {
      return
    }

    setIsDeleting(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.from("skills").delete().eq("id", initialData.id)

      if (error) throw error

      toast({
        title: "Skill deleted",
        description: "Your skill has been deleted successfully.",
      })

      router.push("/admin/skills")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Add Skill" : "Edit Skill"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Skill Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              placeholder="e.g., Programming, Design, Languages"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="proficiency">Proficiency</Label>
              <span>{formData.proficiency}/5</span>
            </div>
            <Slider
              id="proficiency"
              min={1}
              max={5}
              step={1}
              value={[formData.proficiency]}
              onValueChange={handleSliderChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Display Order</Label>
            <Input
              id="order_index"
              name="order_index"
              type="number"
              value={formData.order_index}
              onChange={handleNumberChange}
              min={0}
            />
            <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isNew && (
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || isLoading}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/skills")}
              disabled={isLoading || isDeleting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isDeleting}>
              {isLoading ? "Saving..." : "Save Skill"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

