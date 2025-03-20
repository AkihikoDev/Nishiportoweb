import { getSupabaseBrowserClient } from "./client"

// Initialize storage bucket if needed
export async function ensureStorageBucket(): Promise<boolean> {
  try {
    const response = await fetch("/api/storage/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error ensuring storage bucket:", error)
    return false
  }
}

export async function uploadFile(file: File, bucket = "media", folder = "uploads"): Promise<string | null> {
  try {
    // Ensure bucket exists before uploading
    await ensureStorageBucket()

    const supabase = getSupabaseBrowserClient()

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload the file
    const { error: uploadError, data } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      throw uploadError
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error uploading file:", error)
    return null
  }
}

export async function deleteFile(filePath: string, bucket = "media"): Promise<boolean> {
  if (!filePath) return true

  try {
    const supabase = getSupabaseBrowserClient()

    // Extract the path from the full URL if needed
    let path = filePath
    if (filePath.includes("storage/v1/object/public")) {
      const parts = filePath.split(`${bucket}/`)
      path = parts.length > 1 ? parts[1] : filePath
    }

    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Delete error:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    return false
  }
}

