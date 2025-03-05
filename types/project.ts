export interface Project {
  id: number
  name: string
  budget: string
  description: string
  timeline: string
  goals: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  customerId: number
  createdAt: string
  files?: string[]
}

export interface Proposal {
  id: number
  projectId: number
  adminId: number
  title: string
  description: string
  price: number
  timeline: string
  deliverables: string[]
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export interface Message {
  id: number
  projectId: number
  senderId: number
  senderName?: string
  senderRole?: string
  receiverId: number
  content: string
  createdAt: string
  read: boolean
}

export interface Task {
  id: number
  projectId: number
  title: string
  description: string
  status: "pending" | "in_progress" | "review" | "qa" | "qa_pass" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo?: number
  createdAt: string
}

