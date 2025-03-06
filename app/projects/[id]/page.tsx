"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/store/project-store"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import components
import { ProjectDetailSection } from "@/app/projects/[id]/components/project-detail-section"
import { ProposalsSection } from "@/app/projects/[id]/components/proposals-section"
import { MessagesSection } from "@/app/projects/[id]/components/messages-section"
import { TasksSection } from "@/app/projects/[id]/components/tasks-section"

// Types
import type { AdminUser, TeamMember } from "@/app/projects/[id]/types"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false)
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null)

  const router = useRouter()
  const projectId = Number.parseInt(params.id)

  const { currentProject, fetchProjectById, proposals, fetchProposals, messages, fetchMessages, isLoading, error } =
    useProjectStore()

  const { user } = useAuthStore()

  // Fetch project data
  useEffect(() => {
    const loadProjectData = async () => {
      const project = await fetchProjectById(projectId)
      if (project) {
        await fetchProposals(projectId)
        await fetchMessages(projectId)
      }
    }

    loadProjectData()
  }, [fetchProjectById, fetchProposals, fetchMessages, projectId])

  // Fetch admin users
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoadingAdmins(true)
      try {
        // Get unique admin IDs from proposals
        const adminIds = [...new Set(proposals.map((p) => p.adminId))]

        if (adminIds.length === 0 && user?.role === "customer") {
          // If no proposals yet, fetch all admins for customer
          const response = await fetch(`/api/users?role=admin`)
          if (!response.ok) throw new Error("Failed to fetch admins")

          const adminUsers = await response.json()
          setAdmins(adminUsers)

          // Set the first admin as selected by default if none is selected
          if (adminUsers.length > 0 && !selectedAdminId) {
            setSelectedAdminId(adminUsers[0].id)
          }
        } else if (adminIds.length > 0) {
          // Fetch admin users by IDs
          const response = await fetch(`/api/users?role=admin&ids=${adminIds.join(",")}`)
          if (!response.ok) throw new Error("Failed to fetch admins")

          const adminUsers = await response.json()
          setAdmins(adminUsers)

          // Set the first admin as selected by default if none is selected
          if (adminUsers.length > 0 && !selectedAdminId) {
            setSelectedAdminId(adminUsers[0].id)
          }
        }
      } catch (error) {
        console.error("Error fetching admins:", error)
      } finally {
        setIsLoadingAdmins(false)
      }
    }

    fetchAdmins()
  }, [proposals, selectedAdminId, user?.role])

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembersData = async () => {
      setIsLoadingTeamMembers(true)
      try {
        const response = await fetch(`/api/users?role=team_member`)
        if (!response.ok) throw new Error("Failed to fetch team members")

        const teamMemberUsers = await response.json()
        setTeamMembers(teamMemberUsers)
      } catch (error) {
        console.error("Error fetching team members:", error)
      } finally {
        setIsLoadingTeamMembers(false)
      }
    }

    if (user?.role === "admin") {
      fetchTeamMembersData()
    }
  }, [user?.role])

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading project details...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (error || !currentProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex">
        <div className="flex-1 p-4 md:p-8">
          <div className="container mx-auto max-w-4xl">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>

            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error || "Project not found. It may have been deleted or you don't have permission to view it."}
              </AlertDescription>
            </Alert>

            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has permission to view this project
  const isProjectOwner = user?.id === currentProject.customerId
  const isAdmin = user?.role === "admin"
  const isTeamMember = user?.role === "team_member"

  // Render the project detail page with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex">
      <div className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{currentProject.name}</h1>
                <StatusBadge status={currentProject.status} />
              </div>
              <p className="text-muted-foreground">Submitted {safeFormatDistance(currentProject.createdAt)}</p>
            </div>

            {isAdmin && !proposals.some((p) => p.adminId === user?.id) && (
              <Button
                onClick={() => {
                  setActiveTab("proposals")
                }}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
              >
                Submit Proposal
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="proposals">Proposals {proposals.length ? `(${proposals.length})` : ""}</TabsTrigger>
              <TabsTrigger value="messages">Messages {messages.length ? `(${messages.length})` : ""}</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>

            {/* Project Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <ProjectDetailSection currentProject={currentProject} proposals={proposals} />
            </TabsContent>

            {/* Proposals Tab */}
            <TabsContent value="proposals" className="space-y-6">
              <ProposalsSection
                projectId={projectId}
                proposals={proposals}
                admins={admins}
                isProjectOwner={isProjectOwner}
                isAdmin={isAdmin}
                user={user}
              />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <MessagesSection
                projectId={projectId}
                proposals={proposals}
                messages={messages}
                admins={admins}
                user={user}
                isLoadingAdmins={isLoadingAdmins}
                selectedAdminId={selectedAdminId}
                setSelectedAdminId={setSelectedAdminId}
              />
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <TasksSection
                projectId={projectId}
                isAdmin={isAdmin}
                isTeamMember={isTeamMember}
                teamMembers={teamMembers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper functions
import { formatDistanceToNow } from "date-fns"
import { StatusBadge } from "@/app/projects/[id]/components/ui/status-badge"

// Add this function to safely format dates
export const safeFormatDistance = (dateString: string | undefined) => {
  if (!dateString) return "recently"
  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) return "recently"
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "recently"
  }
}

