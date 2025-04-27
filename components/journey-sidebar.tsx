"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X, Home, History } from "lucide-react"
import { motion } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { PastConversations } from "@/components/past-conversations"

// Mock data for demo purposes
const JOURNEY_DATA = {
  productivity: {
    name: "Productivity Assistant",
    icon: "📝",
    description: "Help you manage tasks, schedule meetings, and boost your productivity",
    image: "https://picsum.photos/seed/productivity/600/400",
  },
  learning: {
    name: "Learning Companion",
    icon: "🧠",
    description: "Guide you through learning new skills with personalized content",
    image: "https://picsum.photos/seed/learning/600/400",
  },
  wellness: {
    name: "Wellness Coach",
    icon: "🧘",
    description: "Support your mental and physical wellbeing with tailored advice",
    image: "https://picsum.photos/seed/wellness/600/400",
  },
  creative: {
    name: "Creative Partner",
    icon: "💡",
    description: "Spark your creativity and help you brainstorm new ideas",
    image: "https://picsum.photos/seed/creative/600/400",
  },
}

interface JourneySidebarProps {
  currentJourneyId: string
  onClose: () => void
  isMobile: boolean
}

export function JourneySidebar({ currentJourneyId, onClose, isMobile }: JourneySidebarProps) {
  const router = useRouter()
  const [isPastConversationsOpen, setIsPastConversationsOpen] = useState(false)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">AI Journeys</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-4 border-b space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/")}>
          <Home className="h-4 w-4" />
          Home
        </Button>

        <Sheet open={isPastConversationsOpen} onOpenChange={setIsPastConversationsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <History className="h-4 w-4" />
              Past Conversations
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[400px] p-0">
            <PastConversations
              conversations={[]} // You'll need to pass the actual conversations here
              onSelect={(conv) => {
                setIsPastConversationsOpen(false)
                // In a real app, this would load the selected conversation
                console.log("Selected conversation:", conv)
              }}
              onClose={() => setIsPastConversationsOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(JOURNEY_DATA).map(([id, journey], index) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/chat/${id}`} className="block">
              <div
                className={`p-3 rounded-lg transition-all ${
                  currentJourneyId === id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{journey.icon}</div>
                  <div className="font-medium">{journey.name}</div>
                </div>
                {currentJourneyId === id && <div className="mt-2 text-sm opacity-90">{journey.description}</div>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
