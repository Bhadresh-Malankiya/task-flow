export interface AdminUser {
  id: number
  name: string
  email?: string
  role: string
}

export interface TeamMember {
  id: number
  name: string
  email?: string
  role: string
}

export interface MessageFormValues {
  content: string
}

export interface ProposalFormValues {
  title: string
  description: string
  price: string
  timeline: string
  deliverables: string
}

export interface TaskFormValues {
  title: string
  description: string
  assignedTo?: string
  status: string
  priority: string
}

