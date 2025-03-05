"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjectStore } from "@/store/project-store"
import { motion } from "framer-motion"
import { ProposalCard } from "./proposal-card"
import { ProposalForm } from "./proposal-form"
import type { AdminUser } from "@/app/projects/[id]/types"
import type { Proposal } from "@/types/project"
import type { User } from "@/store/auth-store"

export function ProposalsSection({
  projectId,
  proposals,
  admins,
  isProjectOwner,
  isAdmin,
  user,
}: {
  projectId: number
  proposals: Proposal[]
  admins: AdminUser[]
  isProjectOwner: boolean
  isAdmin: boolean
  user: User | null
}) {
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [isAcceptingProposal, setIsAcceptingProposal] = useState(false)
  const { acceptProposal, fetchProposals, fetchMessages } = useProjectStore()

  // Handle proposal acceptance
  const handleAcceptProposal = async (proposalId: number) => {
    if (!user) return

    setIsAcceptingProposal(true)
    try {
      const success = await acceptProposal(proposalId)
      if (success) {
        // After accepting, refresh proposals and messages
        await fetchProposals(projectId)
        await fetchMessages(projectId)
      }
    } finally {
      setIsAcceptingProposal(false)
    }
  }

  // Check if current admin has already submitted a proposal
  const hasSubmittedProposal = isAdmin && proposals.some((p) => p.adminId === user?.id)

  return (
    <>
      {showProposalForm && isAdmin && !hasSubmittedProposal && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <ProposalForm
            projectId={projectId}
            onCancel={() => setShowProposalForm(false)}
            onSuccess={() => {
              setShowProposalForm(false)
              fetchProposals(projectId)
            }}
          />
        </motion.div>
      )}

      <Card className="border border-muted shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardTitle>Project Proposals</CardTitle>
          <CardDescription>
            {isProjectOwner ? "Review proposals from our team" : "Proposals submitted for this project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {!showProposalForm && isAdmin && !hasSubmittedProposal && (
            <div className="mb-6">
              <button
                onClick={() => setShowProposalForm(true)}
                className="w-full py-3 border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 
                  rounded-lg transition-colors flex items-center justify-center font-medium"
              >
                + Submit a Proposal
              </button>
            </div>
          )}

          {proposals.length === 0 && !showProposalForm ? (
            <div className="text-center py-8 text-muted-foreground">No proposals have been submitted yet.</div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  adminName={admins.find((a) => a.id === proposal.adminId)?.name || "Admin"}
                  isProjectOwner={isProjectOwner}
                  onAccept={() => handleAcceptProposal(proposal.id)}
                  isAccepting={isAcceptingProposal}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

