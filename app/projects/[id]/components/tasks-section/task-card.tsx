"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskStatusBadge, PriorityBadge } from "@/app/projects/[id]/components/ui/status-badge"
import { safeFormatDistance } from "@/app/projects/[id]/utils"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import type { TeamMember } from "@/app/projects/[id]/types"
import type { Task } from "@/types/project"

export function TaskCard({
  task,
  teamMembers,
  isAdmin,
  isTeamMember,
  onUpdateStatus,
  isUpdating: globalIsUpdating,
}: {
  task: Task
  teamMembers: TeamMember[]
  isAdmin: boolean
  isTeamMember: boolean
  onUpdateStatus: (taskId: number, newStatus: string) => Promise<void>
  isUpdating: boolean
}) {
  // Add local loading state for this specific task
  const [isUpdatingThisTask, setIsUpdatingThisTask] = useState(false)

  const handleStatusChange = async (value: string) => {
    setIsUpdatingThisTask(true)
    try {
      await onUpdateStatus(task.id, value)
    } finally {
      setIsUpdatingThisTask(false)
    }
  }

  return (
    <Card className="overflow-hidden border border-muted hover:border-primary/20 transition-colors">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <TaskStatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Assigned to:</span>
                <span>{teamMembers.find((m) => m.id === task.assignedTo)?.name || "Team Member"}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Created:</span>
              <span>{safeFormatDistance(task.createdAt)}</span>
            </div>
          </div>
        </div>

        {(isAdmin || isTeamMember) && (
          <div className="bg-muted/30 p-4 flex flex-row md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l">
            {isUpdatingThisTask ? (
              <div className="flex items-center justify-center w-[140px] h-10">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            ) : (
              <Select
                value={task.status}
                onValueChange={handleStatusChange}
                disabled={globalIsUpdating || isUpdatingThisTask}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="qa_pass">QA Pass</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

