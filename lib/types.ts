export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  resume_url: string | null
  email: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url: string | null
  project_url: string | null
  github_url: string | null
  order_index: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
  updated_at: string
}

