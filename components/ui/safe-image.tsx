"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { getSafeImageUrl } from "@/lib/utils/image-validator"

interface SafeImageProps {
  src: string | null
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallback?: React.ReactNode
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallback,
  priority = false,
}: SafeImageProps) {
  const [error, setError] = useState(false)
  const safeUrl = getSafeImageUrl(src)

  if (error || !src) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "100%" }}
      >
        <span className="text-muted-foreground text-xl">{alt.charAt(0)}</span>
      </div>
    )
  }

  return (
    <Image
      src={safeUrl || "/placeholder.svg"}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      priority={priority}
    />
  )
}

