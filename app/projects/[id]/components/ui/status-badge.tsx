import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
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

export function TaskStatusBadge({ status }: { status: string }) {
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
    case "review":
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
          Review
        </Badge>
      )
    case "qa":
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
          QA
        </Badge>
      )
    case "qa_pass":
      return (
        <Badge variant="outline" className="bg-teal-500/10 text-teal-500 border-teal-500/20">
          QA Pass
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

export function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case "low":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Low
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          Medium
        </Badge>
      )
    case "high":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          High
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

