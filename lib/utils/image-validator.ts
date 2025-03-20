/**
 * Validates if a URL is a valid image by attempting to load it
 * @param url The URL to validate
 * @returns Promise that resolves to true if valid, false otherwise
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
  if (!url) return false

  try {
    const response = await fetch(url, { method: "HEAD" })

    if (!response.ok) return false

    const contentType = response.headers.get("content-type")
    return contentType ? contentType.startsWith("image/") : false
  } catch (error) {
    console.error("Error validating image URL:", error)
    return false
  }
}

/**
 * Gets a safe image URL that can be used with Next.js Image component
 * If the URL is not valid, returns a placeholder
 */
export function getSafeImageUrl(url: string | null): string {
  if (!url) return "/placeholder.svg"

  // Check if it's a relative URL (starts with /)
  if (url.startsWith("/")) return url

  // Check if it's a valid URL
  try {
    new URL(url)
    return url
  } catch (e) {
    return "/placeholder.svg"
  }
}

