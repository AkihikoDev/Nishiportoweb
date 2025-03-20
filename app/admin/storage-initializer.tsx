"use client"

import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function StorageInitializer() {
  const [initialized, setInitialized] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initStorage = async () => {
    if (initializing) return

    setInitializing(true)
    setError(null)

    try {
      const response = await fetch("/api/storage/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to initialize storage")
      }

      setInitialized(true)
      toast({
        title: "Storage Ready",
        description: data.bucketExists ? "Storage bucket already exists" : "Storage bucket created successfully",
      })
    } catch (error: any) {
      console.error("Storage initialization error:", error)
      setError(error.message || "Failed to initialize storage for file uploads")
      toast({
        title: "Storage Error",
        description: "Failed to initialize storage for file uploads",
        variant: "destructive",
      })
    } finally {
      setInitializing(false)
    }
  }

  useEffect(() => {
    // Auto-initialize on component mount
    initStorage()
  }, [])

  if (initialized) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription className="flex items-center justify-between">
        <span>
          {error
            ? `Storage initialization failed: ${error}`
            : "Storage needs to be initialized for file uploads to work"}
        </span>
        <Button size="sm" onClick={initStorage} disabled={initializing}>
          {initializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Storage"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

