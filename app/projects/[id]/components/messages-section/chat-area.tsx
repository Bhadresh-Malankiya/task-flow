"use client"

import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { MessageSquare, Send, Loader2, CheckCheck } from "lucide-react"
import { useProjectStore } from "@/store/project-store"
import { safeFormat } from "@/app/projects/[id]/utils"
import type { AdminUser } from "@/app/projects/[id]/types"
import type { User } from "@/store/auth-store"
import type { Message, Proposal } from "@/types/project"

// Schema for message form
const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
})

type MessageFormValues = z.infer<typeof messageSchema>

export function ChatArea({
  selectedAdminId,
  admins,
  filteredMessages,
  user,
  proposals,
  projectId,
}: {
  selectedAdminId: number | null
  admins: AdminUser[]
  filteredMessages: Message[]
  user: User | null
  proposals: Proposal[]
  projectId: number
}) {
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const { sendMessage, fetchMessages } = useProjectStore()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const messageForm = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [])

  // Modify the onSendMessage function to prevent page refresh
  const onSendMessage = async (data: MessageFormValues) => {
    if (!user || !selectedAdminId) return

    setIsSendingMessage(true)
    try {
      await sendMessage({
        projectId,
        receiverId: selectedAdminId,
        content: data.content,
      })
      messageForm.reset()
      await fetchMessages(projectId)
    } finally {
      setIsSendingMessage(false)
    }
  }

  if (!selectedAdminId) {
    return (
      <div className="md:col-span-3 flex h-full items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select a contact to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="md:col-span-3 flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center gap-3 bg-card">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {admins.find((a) => a.id === selectedAdminId)?.name.charAt(0) || "A"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{admins.find((a) => a.id === selectedAdminId)?.name || "Admin"}</p>
          <p className="text-xs text-muted-foreground">
            {proposals.find((p) => p.adminId === selectedAdminId)?.status === "accepted"
              ? "Proposal accepted"
              : "Proposal pending"}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        {filteredMessages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => {
              const isCurrentUserMessage = message.senderId === user?.id
              const senderName = isCurrentUserMessage
                ? "You"
                : message.senderName || admins.find((a) => a.id === message.senderId)?.name || "User"

              return (
                <div key={message.id} className={`flex ${isCurrentUserMessage ? "justify-end" : "justify-start"}`}>
                  <div className="flex max-w-[80%] gap-2">
                    {!isCurrentUserMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {senderName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {user?.role === "admin" && !isCurrentUserMessage && (
                        <p className="text-xs text-muted-foreground mb-1">{senderName}</p>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          isCurrentUserMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {safeFormat(message.createdAt, "MMM d, h:mm a")}
                        {isCurrentUserMessage && message.read && <CheckCheck className="ml-1 inline h-3 w-3" />}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Message input - fixed to bottom */}
      <div className="p-4 border-t bg-card mt-auto sticky bottom-0">
        <Form {...messageForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              messageForm.handleSubmit(onSendMessage)(e)
            }}
            className="flex gap-2"
          >
            <FormField
              control={messageForm.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Type your message..."
                      className="min-h-[60px] max-h-[120px] resize-none focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="self-end bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              disabled={isSendingMessage || proposals.find((p) => p.adminId === selectedAdminId)?.status !== "accepted"}
            >
              {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </Form>

        {proposals.find((p) => p.adminId === selectedAdminId)?.status !== "accepted" && (
          <p className="text-xs text-muted-foreground mt-2">
            You need to accept this admin's proposal before you can send messages.
          </p>
        )}
      </div>
    </div>
  )
}

