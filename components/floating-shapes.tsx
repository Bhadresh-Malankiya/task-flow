"use client"
import { useTheme } from "@/components/theme-provider"

export function FloatingShapes() {
  const { theme } = useTheme()

  // This component now only provides the container for the floating shapes
  // The actual floating shapes are rendered directly in the landing page
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* This is now just a placeholder container */}
      {/* The actual floating shapes are rendered in the landing page */}
    </div>
  )
}

