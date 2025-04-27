"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AnimatedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  effect?: "fade" | "zoom" | "slide" | "none"
  priority?: boolean
}

export function AnimatedImage({
  src,
  alt,
  width,
  height,
  className,
  effect = "fade",
  priority = false,
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const isExternal = src.startsWith("http")

  useEffect(() => {
    setIsInView(true)

    // Simulate a slight delay for the animation to be noticeable
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const getAnimationClass = () => {
    if (!isInView) return "opacity-0"

    switch (effect) {
      case "fade":
        return isLoaded ? "opacity-100 transition-opacity duration-700" : "opacity-0"
      case "zoom":
        return isLoaded ? "scale-100 opacity-100 transition-all duration-700" : "scale-95 opacity-0"
      case "slide":
        return isLoaded ? "translate-y-0 opacity-100 transition-all duration-700" : "translate-y-4 opacity-0"
      case "none":
      default:
        return ""
    }
  }

  return (
    <div className={cn("overflow-hidden rounded-lg", className)}>
      {isExternal ? (
        // For external URLs like picsum.photos
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn("w-full h-full object-cover", getAnimationClass())}
          onLoad={() => setIsLoaded(true)}
          width={width}
          height={height}
        />
      ) : (
        // For internal images
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          className={cn("object-cover", getAnimationClass())}
          onLoad={() => setIsLoaded(true)}
          priority={priority}
        />
      )}
    </div>
  )
}
