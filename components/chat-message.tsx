"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Star, Upload, Calendar, Clock, Check } from "lucide-react"
import Link from "next/link"
import { AnimatedImage } from "@/components/animated-image"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TimePickerDemo } from "@/components/time-picker"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  type: "text" | "image" | "journey" | "rating" | "carousel" | "datepicker" | "fileupload" | "form" | "quickreplies"
  data?: any
}

interface ChatMessageProps {
  message: Message
  onSendMessage: (text: string) => void
}

export function ChatMessage({ message, onSendMessage }: ChatMessageProps) {
  const isUser = message.role === "user"
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [isFileSelected, setIsFileSelected] = useState(false)
  const [fileName, setFileName] = useState("")

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[85%] gap-3`}>
        <Avatar className={`h-8 w-8 ${isUser ? "bg-primary" : "bg-secondary"}`}>
          <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
          {!isUser && <AvatarImage src="https://picsum.photos/seed/ai-avatar/32/32" alt="AI" />}
        </Avatar>

        <div className="space-y-2">
          {renderMessageContent(
            message,
            selectedRating,
            setSelectedRating,
            date,
            setDate,
            time,
            setTime,
            formData,
            setFormData,
            isFormSubmitted,
            setIsFormSubmitted,
            isFileSelected,
            setIsFileSelected,
            fileName,
            setFileName,
            onSendMessage,
          )}
        </div>
      </div>
    </div>
  )
}

function renderMessageContent(
  message: Message,
  selectedRating: number | null,
  setSelectedRating: (rating: number | null) => void,
  date: Date | undefined,
  setDate: (date: Date | undefined) => void,
  time: string,
  setTime: (time: string) => void,
  formData: Record<string, string>,
  setFormData: (data: Record<string, string>) => void,
  isFormSubmitted: boolean,
  setIsFormSubmitted: (submitted: boolean) => void,
  isFileSelected: boolean,
  setIsFileSelected: (selected: boolean) => void,
  fileName: string,
  setFileName: (name: string) => void,
  onSendMessage: (text: string) => void,
) {
  switch (message.type) {
    case "text":
      return (
        <div
          className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <p>{message.content}</p>
        </div>
      )

    case "image":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <Card className="overflow-hidden border-0 shadow-md">
            <CardContent className="p-0">
              <AnimatedImage
                src={message.data?.imageUrl || "https://picsum.photos/seed/default/400/300"}
                alt={message.data?.altText || "Generated image"}
                width={400}
                height={300}
                effect="zoom"
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      )

    case "journey":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <div className="flex flex-col gap-2">
            {message.data?.journeys.map((journey: any) => (
              <Link href={`/chat/${journey.id}`} key={journey.id}>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="mr-2">{journey.icon}</span>
                  {journey.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )

    case "rating":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.div key={rating} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedRating === rating ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 transition-all ${
                    selectedRating === rating ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => setSelectedRating(rating)}
                >
                  <Star
                    className={`h-4 w-4 ${selectedRating !== null && rating <= selectedRating ? "fill-current" : ""}`}
                  />
                </Button>
              </motion.div>
            ))}
          </div>
          {selectedRating !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="text-sm text-muted-foreground"
            >
              Thanks for your feedback!
            </motion.div>
          )}
        </div>
      )

    case "carousel":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {message.data?.items.map((item: any) => (
                <CarouselItem key={item.id}>
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      <AnimatedImage
                        src={item.imageUrl || `https://picsum.photos/seed/carousel-${item.id}/200/150`}
                        alt={item.title}
                        width={200}
                        height={150}
                        effect="fade"
                        className="w-full"
                      />
                      <div className="p-3">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )

    case "datepicker":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Clock className="mr-2 h-4 w-4" />
                    <TimePickerDemo setTime={setTime} />
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!date || !time}
                onClick={() => {
                  if (date && time) {
                    const formattedDate = format(date, "PPP")
                    onSendMessage(`I've selected ${formattedDate} at ${time}`)
                  }
                }}
              >
                Confirm Selection
              </Button>
            </div>
          </Card>
        </div>
      )

    case "fileupload":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isFileSelected ? fileName : "Drag and drop files here or click to browse"}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setIsFileSelected(true)
                      setFileName(file.name)
                    }
                  }}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="mt-4" onClick={() => {}}>
                    Browse Files
                  </Button>
                </label>
              </div>

              {isFileSelected && (
                <Button
                  className="w-full"
                  onClick={() => {
                    onSendMessage(`I've uploaded ${fileName}`)
                    setIsFileSelected(false)
                    setFileName("")
                  }}
                >
                  Upload File
                </Button>
              )}
            </div>
          </Card>
        </div>
      )

    case "form":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <Card className="p-4">
            {!isFormSubmitted ? (
              <div className="space-y-4">
                {message.data?.fields.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      />
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ""}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                <Button
                  className="w-full"
                  onClick={() => {
                    setIsFormSubmitted(true)
                    // In a real app, you would process the form data here
                    onSendMessage(`I've submitted the form with ${Object.keys(formData).length} fields`)
                  }}
                >
                  Submit
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Form Submitted Successfully</p>
                <p className="text-sm text-muted-foreground text-center">
                  Thank you for your submission. We'll process your information.
                </p>
              </div>
            )}
          </Card>
        </div>
      )

    case "quickreplies":
      return (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            <p>{message.content}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.data?.options.map((option: any) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                className="rounded-full h-8 px-3 py-0 text-xs"
                onClick={() => onSendMessage(option.text)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div
          className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <p>{message.content}</p>
        </div>
      )
  }
}
