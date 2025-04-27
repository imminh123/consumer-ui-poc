"use client"

import { useState } from "react"
import { X, Search, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

type Conversation = {
  id: string
  journeyId: string
  title: string
  preview: string
  date: string
  messages: any[]
}

interface PastConversationsProps {
  conversations: Conversation[]
  onSelect: (conversation: Conversation) => void
  onClose: () => void
}

export function PastConversations({ conversations, onSelect, onClose }: PastConversationsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg">Past Conversations</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <button
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors border border-transparent hover:border-border"
                  onClick={() => onSelect(conversation)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{conversation.title}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{conversation.preview}</p>
                  <div className="flex justify-end mt-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No conversations found</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
