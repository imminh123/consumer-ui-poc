"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, Menu, ChevronRight, X } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { VoiceVisualizer } from "@/components/voice-visualizer"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"
import { JourneySidebar } from "@/components/journey-sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Mock data for demo purposes
const JOURNEY_DATA = {
  productivity: {
    name: "Productivity Assistant",
    icon: "📝",
    welcomeMessage: "Hi there! I'm your Productivity Assistant. How can I help you today?",
    image: "https://picsum.photos/seed/productivity/600/400",
    steps: ["Introduction", "Task Analysis", "Prioritization", "Scheduling", "Review"],
  },
  learning: {
    name: "Learning Companion",
    icon: "🧠",
    welcomeMessage: "Hello! I'm your Learning Companion. What would you like to learn today?",
    image: "https://picsum.photos/seed/learning/600/400",
    steps: ["Topic Selection", "Skill Assessment", "Learning Plan", "Practice", "Mastery"],
  },
  wellness: {
    name: "Wellness Coach",
    icon: "🧘",
    welcomeMessage: "Welcome! I'm your Wellness Coach. How are you feeling today?",
    image: "https://picsum.photos/seed/wellness/600/400",
    steps: ["Check-in", "Goal Setting", "Daily Plan", "Reflection", "Progress"],
  },
  creative: {
    name: "Creative Partner",
    icon: "💡",
    welcomeMessage: "Hey there! I'm your Creative Partner. Let's spark some ideas together!",
    image: "https://picsum.photos/seed/creative/600/400",
    steps: ["Inspiration", "Ideation", "Development", "Refinement", "Completion"],
  },
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  type: "text" | "image" | "journey" | "rating" | "carousel" | "datepicker" | "fileupload" | "form" | "quickreplies"
  data?: any
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const journeyId = params.journeyId as string
  const journey = JOURNEY_DATA[journeyId as keyof typeof JOURNEY_DATA]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: journey?.welcomeMessage || "Hello! How can I help you today?",
      type: "text",
    },
  ])

  const [input, setInput] = useState("")
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isProgressOpen, setIsProgressOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to handle dynamic content based on user input
  const handleDynamicContent = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()

    // Check for specific widget triggers
    if (lowerInput.includes("datepicker") || lowerInput.includes("date picker")) {
      return {
        type: "datepicker",
        content: "Please select a date and time:",
      }
    } else if (lowerInput.includes("fileupload") || lowerInput.includes("file upload")) {
      return {
        type: "fileupload",
        content: "Upload a file to continue:",
      }
    } else if (lowerInput.includes("rating") || lowerInput.includes("feedback")) {
      return {
        type: "rating",
        content: "How would you rate your experience?",
      }
    } else if (lowerInput.includes("form")) {
      return {
        type: "form",
        content: "Please fill out this quick form:",
        data: {
          fields: [
            { id: "name", label: "Name", type: "text", placeholder: "Your name" },
            { id: "email", label: "Email", type: "email", placeholder: "Your email" },
            { id: "message", label: "Message", type: "textarea", placeholder: "Your message" },
          ],
        },
      }
    } else if (lowerInput.includes("quickreplies") || lowerInput.includes("quick replies")) {
      return {
        type: "quickreplies",
        content: "Choose a quick response:",
        data: {
          options: [
            { id: "1", text: "Yes, please" },
            { id: "2", text: "No, thank you" },
            { id: "3", text: "Tell me more" },
            { id: "4", text: "I need help" },
          ],
        },
      }
    } else if (lowerInput.includes("carousel")) {
      return {
        type: "carousel",
        content: "Here's a carousel view of options:",
        data: {
          items: [
            {
              id: "1",
              title: "Option 1",
              description: "Description for option 1",
              imageUrl: "https://picsum.photos/seed/carousel1/200/150",
            },
            {
              id: "2",
              title: "Option 2",
              description: "Description for option 2",
              imageUrl: "https://picsum.photos/seed/carousel2/200/150",
            },
            {
              id: "3",
              title: "Option 3",
              description: "Description for option 3",
              imageUrl: "https://picsum.photos/seed/carousel3/200/150",
            },
          ],
        },
      }
    } else if (lowerInput.includes("image")) {
      return {
        type: "image",
        content: "Here's the image you requested:",
        data: {
          imageUrl: "https://picsum.photos/seed/requested/400/300",
          altText: "Generated image based on user request",
        },
      }
    } else if (lowerInput.includes("journey") || lowerInput.includes("suggestion")) {
      return {
        type: "journey",
        content: "Here are some journey suggestions that might interest you:",
        data: {
          journeys: Object.entries(JOURNEY_DATA).map(([id, data]) => ({
            id,
            title: data.name,
            icon: data.icon,
          })),
        },
      }
    } else {
      // Default text response
      return {
        type: "text",
        content: "I understand you're asking about " + userInput + ". How can I help you further with this?",
      }
    }
  }

  // Mock function to simulate AI response
  const handleSendMessage = (default_input?: string) => {
    const send_message = default_input || input
    console.log("Sending message:", send_message)
    if (!send_message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: send_message,
      type: "text",
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response with dynamic content
    setTimeout(() => {
      const dynamicResponse = handleDynamicContent(userMessage.content)

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: dynamicResponse.content,
        type: dynamicResponse.type as Message["type"],
        data: dynamicResponse.data,
      }

      setMessages((prev) => [...prev, aiResponse])

      // Update journey progress (for demo purposes)
      if (Math.random() > 0.7 && currentStep < journey.steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      }
    }, 1000)
  }

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode)
    if (isRecording) {
      setIsRecording(false)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // In a real app, this would handle voice recording and transcription
    console.log("Started recording")

    // Simulate recording for 3 seconds then auto-submit
    setTimeout(() => {
      stopRecordingAndSubmit()
    }, 3000)
  }

  const stopRecordingAndSubmit = () => {
    setIsRecording(false)
    console.log("Stopped recording")

    // Simulate transcribed text
    const transcribedOptions = [
      "Show me a carousel of options",
      "Can you display an image?",
      "I'd like some journey suggestions",
      "Show me a date picker",
      "I need a file upload",
      "Can I see a rating widget?",
      "Show me a form",
      "I need some quick replies",
    ]
    const transcribedText = transcribedOptions[Math.floor(Math.random() * transcribedOptions.length)]

    setInput(transcribedText)

    // Auto-submit after a brief delay
    setTimeout(() => {
      handleSendMessage()
      setIsVoiceMode(false) // Exit voice mode after submission
    }, 500)
  }

  const cancelRecording = () => {
    setIsRecording(false)
    console.log("Recording cancelled")
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!mounted) return null

  return (
    <div className="chat-layout">
      {/* Sidebar - hidden on mobile unless toggled */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <motion.div
            initial={{ x: isMobile ? -300 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-r bg-background ${isMobile ? "fixed inset-y-0 left-0 z-40 w-[300px]" : ""}`}
          >
            <JourneySidebar currentJourneyId={journeyId} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex flex-col h-full relative">
        {/* Voice Mode Overlay */}
        <AnimatePresence>
          {isVoiceMode && (
            <motion.div
              className="absolute inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-4 right-4">
                <Button variant="ghost" size="icon" onClick={toggleVoiceMode} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-center mb-8">
                <div className="text-2xl font-semibold mb-2">{journey?.name}</div>
                <p className="text-muted-foreground">
                  {isRecording ? "Listening..." : "Tap the microphone to start speaking"}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <VoiceVisualizer isActive={isRecording} />

                <div className="mt-8">
                  <Button
                    size="lg"
                    variant={isRecording ? "destructive" : "default"}
                    className={cn(
                      "rounded-full h-16 w-16 flex items-center justify-center transition-all",
                      isRecording && "animate-pulse",
                    )}
                    onClick={isRecording ? cancelRecording : startRecording}
                  >
                    {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {isRecording
                    ? "Your message will be sent automatically when you finish speaking"
                    : "Your voice will be transcribed and sent as a message"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat header */}
        <motion.div
          className="py-4 px-4 border-b flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                {journey?.icon}
              </div>
              <h1 className="text-xl font-semibold">{journey?.name}</h1>
            </div>
          </div>

          {/* Journey Progress Button - Replaces back button */}
          <Sheet open={isProgressOpen} onOpenChange={setIsProgressOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ChevronRight className="h-4 w-4" />
                <span className="hidden sm:inline">Journey Progress</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Journey Progress</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsProgressOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 flex-1">
                  <div className="flex flex-col space-y-4">
                    {journey.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0
                            ${
                              index <= currentStep
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              index <= currentStep ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </div>
                          {index < journey.steps.length - 1 && <div className="ml-4 mt-1 mb-1 w-0.5 h-4 bg-border" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ChatMessage
                message={message}
                onSendMessage={(text) => {
                  setInput(text)
                  handleSendMessage(text)
                }}
              />
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <motion.div
          className="py-2 px-4 border-t"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Quick Replies Bar - Always visible */}
          <div className="mb-2 flex items-center overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex gap-2">
              {["Carousel", "Rating", "Journey", "Form", "File upload", "Image"].map((text) => (
                <Button 
                  key={text}
                  variant="outline"
                  size="sm"
                  className="rounded-full whitespace-nowrap"
                  onClick={() => {
                    setInput(text)
                    handleSendMessage(text)
                  }}
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mode Button */}
            <Button variant="outline" size="icon" onClick={toggleVoiceMode} className="rounded-full h-10 w-10">
              <Mic className="h-4 w-4" />
            </Button>

            {/* Text Input */}
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 rounded-full border-2 focus-visible:ring-primary h-10"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()} className="rounded-full h-10 w-10">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
