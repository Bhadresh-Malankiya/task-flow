import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import type { AdminUser } from "@/app/projects/[id]/types"
import type { User } from "@/store/auth-store"
import type { Message, Proposal } from "@/types/project"

export function ChatSidebar({
  admins,
  isLoadingAdmins,
  selectedAdminId,
  setSelectedAdminId,
  proposals,
  messages,
  user,
  searchQuery,
  setSearchQuery,
}: {
  admins: AdminUser[]
  isLoadingAdmins: boolean
  selectedAdminId: number | null
  setSelectedAdminId: (id: number | null) => void
  proposals: Proposal[]
  messages: Message[]
  user: User | null
  searchQuery: string
  setSearchQuery: (query: string) => void
}) {
  return (
    <div className="border-r md:col-span-1">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-57px)]">
        {isLoadingAdmins ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No contacts found</div>
        ) : (
          admins.map((admin) => {
            // Count unread messages from this admin
            const unreadCount = messages.filter(
              (m) => m.senderId === admin.id && m.receiverId === user?.id && !m.read,
            ).length

            // Check if this admin has an accepted proposal
            const hasAcceptedProposal = proposals.find((p) => p.adminId === admin.id && p.status === "accepted")

            return (
              <div
                key={admin.id}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                  selectedAdminId === admin.id ? "bg-muted" : ""
                }`}
                onClick={() => setSelectedAdminId(admin.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">{admin.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate">{admin.name}</p>
                    {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {hasAcceptedProposal ? "Proposal accepted" : "Proposal pending"}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </ScrollArea>
    </div>
  )
}

