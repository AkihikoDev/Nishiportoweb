"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadFile, ensureStorageBucket } from "@/lib/supabase/storage-utils"
import { Loader2, X, Upload, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  accept?: string
  maxSizeMB?: number
  label?: string
  previewUrl?: string
  onRemove?: () => void
}

export function FileUpload({
  onUploadComplete,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Upload file",
  previewUrl,
  onRemove,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(previewUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isImage = accept.includes("image")
  const isVideo = accept.includes("video")
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Ensure storage bucket exists
      const bucketReady = await ensureStorageBucket()
      if (!bucketReady) {
        throw new Error("Storage not available. Please initialize storage first.")
      }

      // Create preview for images
      if (isImage) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setPreview(event.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else if (isVideo) {
        // For videos, we'll just show a placeholder or the video element after upload
        setPreview(URL.createObjectURL(file))
      }

      // Upload to Supabase Storage
      const folder = isImage ? "images" : isVideo ? "videos" : "files"
      const url = await uploadFile(file, "media", folder)

      if (url) {
        onUploadComplete(url)
        toast({
          title: "Upload successful",
          description: `${isImage ? "Image" : isVideo ? "Video" : "File"} uploaded successfully`,
        })
      } else {
        throw new Error("Failed to upload file")
      }
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "An error occurred during upload")
      setPreview(null)
      toast({
        title: "Upload failed",
        description: err.message || "An error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>

      {!preview ? (
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed ${error ? "border-destructive" : "border-muted-foreground/25"} rounded-md p-6 transition-colors hover:border-muted-foreground/50`}
        >
          <Input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant={error ? "destructive" : "outline"}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mb-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : error ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Try Again
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Select {isImage ? "Image" : isVideo ? "Video" : "File"}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            {isImage ? "JPG, PNG or GIF" : isVideo ? "MP4, WebM or OGG" : "Any file"} up to {maxSizeMB}MB
          </p>
          {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        </div>
      ) : (
        <div className="relative border rounded-md overflow-hidden">
          {isImage && (
            <div className="relative aspect-video w-full">
              <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
            </div>
          )}
          {isVideo && <video src={preview} controls className="w-full aspect-video object-contain bg-black" />}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

