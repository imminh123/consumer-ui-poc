"use client"

import { useEffect, useRef } from "react"

export function VoiceVisualizer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    let animationFrameId: number
    const bars: number[] = []
    const barCount = 60 // Increased bar count for smoother circular visualization

    // Initialize bars
    for (let i = 0; i < barCount; i++) {
      bars[i] = Math.random() * 0.2 + 0.1 // Start with small values
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Create gradient for active state
      let gradient
      if (isActive) {
        gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius)
        gradient.addColorStop(0, "rgba(236, 72, 153, 0.8)") // Pink-500
        gradient.addColorStop(1, "rgba(219, 39, 119, 0.4)") // Pink-600
      }

      // Draw circular visualizer
      for (let i = 0; i < barCount; i++) {
        if (isActive) {
          // When active, animate the bars with more dynamic movement
          const time = Date.now() / 1000
          const oscillation = Math.sin(time * 3 + i * 0.2) * 0.2
          const targetHeight = Math.random() * 0.6 + 0.2 + oscillation
          bars[i] = bars[i] + (targetHeight - bars[i]) * 0.2 // Faster transition
        } else {
          // When inactive, gradually return to small values with slight movement
          const time = Date.now() / 2000
          const oscillation = Math.sin(time + i * 0.1) * 0.05
          bars[i] = 0.1 + oscillation
        }

        const angle = (i / barCount) * Math.PI * 2
        const barHeight = bars[i] * radius

        // Calculate start and end points for the bar
        const innerRadius = radius * 0.4
        const startX = centerX + Math.cos(angle) * innerRadius
        const startY = centerY + Math.sin(angle) * innerRadius
        const endX = centerX + Math.cos(angle) * (innerRadius + barHeight)
        const endY = centerY + Math.sin(angle) * (innerRadius + barHeight)

        // Draw the bar
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.lineWidth = 3
        ctx.lineCap = "round"

        // Use gradient when active, otherwise use muted color
        ctx.strokeStyle = isActive ? gradient || "rgba(236, 72, 153, 0.8)" : "rgba(163, 163, 163, 0.5)"

        ctx.stroke()
      }

      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = isActive ? "rgba(236, 72, 153, 0.2)" : "rgba(163, 163, 163, 0.2)"
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive])

  return (
    <div className={`p-2 rounded-full transition-all ${isActive ? "bg-primary/5" : ""}`}>
      <canvas ref={canvasRef} width={240} height={240} className="rounded-full" />
    </div>
  )
}
