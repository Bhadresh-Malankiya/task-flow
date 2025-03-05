import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, DollarSign } from "lucide-react"
import type { Project, Proposal } from "@/types/project"

export function ProjectDetailSection({
  currentProject,
  proposals,
}: {
  currentProject: Project
  proposals: Proposal[]
}) {
  return (
    <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Information about this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
            <p className="text-lg font-semibold flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-primary" />${currentProject.budget}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Timeline</h3>
            <p className="text-lg font-semibold flex items-center gap-1">
              <Clock className="h-5 w-5 text-primary" />
              {currentProject.timeline}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <p>{currentProject.description}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Goals</h3>
          <p>{currentProject.goals}</p>
        </div>

        {proposals.some((p) => p.status === "accepted") && (
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
            <h3 className="text-sm font-medium text-green-500 flex items-center gap-1 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              Accepted Proposal
            </h3>
            <p className="mb-2">This project has an accepted proposal.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {proposals
                .filter((p) => p.status === "accepted")
                .map((p) => (
                  <div key={p.id} className="space-y-2">
                    <div>
                      <span className="text-muted-foreground">Price:</span> ${p.price}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timeline:</span> {p.timeline}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

