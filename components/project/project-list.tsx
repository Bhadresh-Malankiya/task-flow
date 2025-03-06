"use client"

import { useRouter } from "next/navigation"
import type { Project } from "@/types/project"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronRight, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter()

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No projects found. Create a new project to get started.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="p-6 hover:bg-accent/10 transition-colors cursor-pointer"
          onClick={() => router.push(`/projects/${project.id}`)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Budget: ${project.budget}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Timeline: {project.timeline}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Submitted: {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
            <Button variant="ghost" className="ml-auto" size="sm">
              View Details <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          Pending
        </Badge>
      )
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Completed
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

