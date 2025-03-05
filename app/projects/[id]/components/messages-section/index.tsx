"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { MessageSquare, RefreshCw } from "lucide-react"
import { useProjectStore } from "@/store/project-store"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import type { AdminUser } from "@/app/projects/[id]/types"
import type { User } from "@/store/auth-store"
import type { Proposal, Message } from "@/types/project"

export function MessagesSection({
  projectId,
  proposals,
  messages,
  admins,
  user,
  isLoadingAdmins,
  selectedAdminId,
  setSelectedAdminId,
}: {
  projectId: number
  proposals: Proposal[]
  messages: Message[]
  admins: AdminUser[]
  user: User | null
  isLoadingAdmins: boolean
  selectedAdminId: number | null
  setSelectedAdminId: (id: number | null) => void
}) {
  const [isRefreshingMessages, setIsRefreshingMessages] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { fetchMessages } = useProjectStore()

  // Handle refreshing messages
  const handleRefreshMessages = async () => {
    setIsRefreshingMessages(true)
    try {
      await fetchMessages(projectId)
    } finally {
      setIsRefreshingMessages(false)
    }
  }

  // Filter messages based on selected admin and current user
  const filteredMessages = messages.filter((message) => {
    // For admin users, show all messages related to the selected admin and any customer
    if (user?.role === "admin") {
      return message.senderId === selectedAdminId || message.receiverId === selectedAdminId
    }

    // For customers, only show messages between them and the selected admin
    return (
      (message.senderId === selectedAdminId && message.receiverId === user?.id) ||
      (message.senderId === user?.id && message.receiverId === selectedAdminId)
    )
  })

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) => admin.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Card className="overflow-hidden border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div>
          <CardTitle>Project Messages</CardTitle>
          <CardDescription>
            {proposals.some((p) => p.status === "accepted")
              ? "Communicate with the project team"
              : "Messages will be available after a proposal is accepted"}
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefreshMessages} disabled={isRefreshingMessages}>
          <RefreshCw className={`h-4 w-4 ${isRefreshingMessages ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      {!proposals.some((p) => p.status === "accepted") ? (
        <CardContent className="p-6">
          <Alert className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>A proposal needs to be accepted before messaging is available.</AlertDescription>
          </Alert>
        </CardContent>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 h-[600px] overflow-hidden">
          {/* Chat sidebar */}
          <ChatSidebar
            admins={filteredAdmins}
            isLoadingAdmins={isLoadingAdmins}
            selectedAdminId={selectedAdminId}
            setSelectedAdminId={setSelectedAdminId}
            proposals={proposals}
            messages={messages}
            user={user}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Chat area */}
          <ChatArea
            selectedAdminId={selectedAdminId}
            admins={admins}
            filteredMessages={filteredMessages}
            user={user}
            proposals={proposals}
            projectId={projectId}
          />
        </div>
      )}
    </Card>
  )
}

