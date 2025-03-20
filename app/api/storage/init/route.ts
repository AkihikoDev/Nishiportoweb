import { getSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Check if media bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ success: false, error: "Failed to list storage buckets" }, { status: 500 })
    }

    const mediaBucket = buckets?.find((bucket) => bucket.name === "media")

    if (!mediaBucket) {
      // Create the media bucket
      const { error: createError } = await supabase.storage.createBucket("media", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ success: false, error: "Failed to create storage bucket" }, { status: 500 })
      }

      // Set bucket public policy
      const { error: policyError } = await supabase.storage.from("media").createSignedUrl("dummy.txt", 1)

      if (policyError && !policyError.message.includes("not found")) {
        console.error("Error setting bucket policy:", policyError)
      }

      console.log("Media bucket created successfully")
    } else {
      console.log("Media bucket already exists")
    }

    return NextResponse.json({
      success: true,
      message: "Storage initialized successfully",
      bucketExists: !!mediaBucket,
    })
  } catch (error) {
    console.error("Error initializing storage:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize storage" }, { status: 500 })
  }
}

