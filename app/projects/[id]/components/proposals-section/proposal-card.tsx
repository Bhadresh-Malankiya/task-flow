"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Loader2 } from "lucide-react"
import { safeFormatDistance } from "@/app/projects/[id]/utils"
import type { Proposal } from "@/types/project"

export function ProposalCard({
  proposal,
  adminName,
  isProjectOwner,
  onAccept,
  isAccepting,
}: {
  proposal: Proposal
  adminName: string
  isProjectOwner: boolean
  onAccept: () => void
  isAccepting: boolean
}) {
  return (
    <Card className="border border-muted hover:border-primary/20 transition-colors shadow-md hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{proposal.title || `Proposal from ${adminName}`}</CardTitle>
            <CardDescription>Submitted {safeFormatDistance(proposal.createdAt)}</CardDescription>
          </div>
          {proposal.status === "accepted" && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Accepted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">${proposal.price}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Timeline</p>
            <p className="font-medium">{proposal.timeline}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Description</p>
          <p>{proposal.description}</p>
        </div>
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Deliverables</p>
            <ul className="list-disc pl-5 space-y-1">
              {proposal.deliverables.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {isProjectOwner && proposal.status !== "accepted" && (
        <CardFooter>
          <Button
            onClick={onAccept}
            disabled={isAccepting}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            {isAccepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Accept Proposal
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

