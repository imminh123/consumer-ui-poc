"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardTitle, CardContent } from "@/components/ui/card"
import { AnimatedImage } from "@/components/animated-image"
import { motion } from "framer-motion"

// High-quality images using picsum.photos
const journeyImages = {
  productivity: "https://picsum.photos/seed/productivity/600/400",
  learning: "https://picsum.photos/seed/learning/600/400",
  wellness: "https://picsum.photos/seed/wellness/600/400",
  creative: "https://picsum.photos/seed/creative/600/400",
}

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const journeys = [
    {
      id: "productivity",
      title: "Productivity Assistant",
      description: "Help you manage tasks, schedule meetings, and boost your productivity",
      icon: "📝",
      image: journeyImages.productivity,
      size: "large", // For Bento UI sizing
    },
    {
      id: "learning",
      title: "Learning Companion",
      description: "Guide you through learning new skills with personalized content",
      icon: "🧠",
      image: journeyImages.learning,
      size: "medium",
    },
    {
      id: "wellness",
      title: "Wellness Coach",
      description: "Support your mental and physical wellbeing with tailored advice",
      icon: "🧘",
      image: journeyImages.wellness,
      size: "medium",
    },
    {
      id: "creative",
      title: "Creative Partner",
      description: "Spark your creativity and help you brainstorm new ideas",
      icon: "💡",
      image: journeyImages.creative,
      size: "small",
    },
  ]

  if (!mounted) return null

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Your AI Companion</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          Choose Your Journey
        </h1>
        <p className="text-lg text-muted-foreground">
          Select a journey to start a conversation with your personalized AI assistant
        </p>
      </motion.div>

      {/* Bento Masonry Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 max-w-5xl mx-auto space-y-6">
        {journeys.map((journey, index) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="break-inside-avoid"
          >
            <Link href={`/chat/${journey.id}`} className="block w-full">
              <Card className="overflow-hidden border-2 hover:border-primary transition-all hover:shadow-lg group">
                <div
                  className={`${journey.size === "large" ? "aspect-video" : "aspect-square"} w-full overflow-hidden`}
                >
                  <AnimatedImage
                    src={journey.image}
                    alt={journey.title}
                    width={600}
                    height={400}
                    effect="zoom"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-3xl transform transition-transform group-hover:scale-110 duration-300">
                      {journey.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {journey.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{journey.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="ghost" className="w-full justify-between group">
                    <span>Start journey</span>
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Past Conversations Card */}
        <motion.div
          className="md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link href="/past-conversations" className="block h-full">
            <Card className="h-full overflow-hidden border-2 hover:border-primary transition-all hover:shadow-lg group bg-secondary/50">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                <History className="h-12 w-12 mb-4 text-primary" />
                <CardTitle className="text-xl group-hover:text-primary transition-colors mb-2">
                  Past Conversations
                </CardTitle>
                <CardDescription>View your conversation history and continue where you left off</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
