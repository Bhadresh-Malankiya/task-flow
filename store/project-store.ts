"use client"

import { create } from "zustand"
import type { Project, Proposal, Message } from "@/types/project"
import { useAuthStore } from "@/store/auth-store"

// Mock projects for offline mode
const MOCK_PROJECTS = [
  {
    id: 1,
    name: "E-commerce Website Redesign",
    budget: "5000",
    description: "Complete redesign of our e-commerce platform with modern UI and improved user experience.",
    timeline: "2 months",
    goals: "Increase conversion rate by 20% and improve mobile responsiveness.",
    status: "in_progress" as const,
    customerId: 3,
    createdAt: "2023-11-01T10:00:00.000Z",
    files: ["design_mockups.pdf", "requirements.docx"],
  },
  {
    id: 2,
    name: "Mobile App Development",
    budget: "8000",
    description:
      "Develop a native mobile app for iOS and Android platforms with user authentication and payment processing.",
    timeline: "3 months",
    goals: "Launch on both app stores with at least 100 initial downloads.",
    status: "pending" as const,
    customerId: 3,
    createdAt: "2023-11-15T14:30:00.000Z",
    files: ["app_wireframes.pdf"],
  },
]

// Mock proposals for offline mode
const MOCK_PROPOSALS = [
  {
    id: 1,
    projectId: 1,
    adminId: 1,
    title: "E-commerce Redesign Proposal",
    description:
      "Our team will completely redesign your e-commerce platform with a focus on conversion optimization and mobile responsiveness.",
    price: 4800,
    timeline: "8 weeks",
    deliverables: [
      "Responsive website design",
      "Product catalog optimization",
      "Checkout process redesign",
      "SEO improvements",
    ],
    status: "accepted" as const,
    createdAt: "2023-11-05T09:15:00.000Z",
  },
  {
    id: 2,
    projectId: 1,
    adminId: 2,
    title: "E-commerce Platform Overhaul",
    description:
      "We'll transform your e-commerce site with a modern design focused on user experience and conversion rate optimization.",
    price: 5200,
    timeline: "10 weeks",
    deliverables: ["UX/UI redesign", "Mobile-first approach", "Performance optimization", "Analytics integration"],
    status: "pending" as const,
    createdAt: "2023-11-06T14:30:00.000Z",
  },
]

// Mock messages for offline mode
const MOCK_MESSAGES = [
  {
    id: 1,
    projectId: 1,
    senderId: 1,
    senderName: "Admin User",
    senderRole: "admin",
    receiverId: 3,
    content:
      "Hello! I've reviewed your project requirements and submitted a proposal. Let me know if you have any questions.",
    createdAt: "2023-11-05T10:30:00.000Z",
    read: true,
  },
  {
    id: 2,
    projectId: 1,
    senderId: 3,
    senderName: "Customer",
    senderRole: "customer",
    receiverId: 1,
    content: "Thanks for the proposal. I like what you've outlined. Can we discuss the timeline in more detail?",
    createdAt: "2023-11-05T14:45:00.000Z",
    read: true,
  },
  {
    id: 3,
    projectId: 1,
    senderId: 2,
    senderName: "Another Admin",
    senderRole: "admin",
    receiverId: 3,
    content: "I've submitted an alternative proposal for your consideration. Happy to discuss the details.",
    createdAt: "2023-11-06T15:20:00.000Z",
    read: false,
  },
]

// Update the isServerAvailable function to better handle errors
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    // Use a relative URL path that matches our API routes
    const response = await fetch("/api/health-check", {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })

    clearTimeout(timeoutId)

    // Check if the response is JSON
    const contentType = response.headers.get("content-type")
    return response.ok && contentType && contentType.includes("application/json")
  } catch (error) {
    console.warn("Server check failed:", error)
    return false
  }
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  proposals: Proposal[]
  messages: Message[]
  isLoading: boolean
  error: string | null
  offlineMode: boolean

  // Project methods
  fetchProjects: () => Promise<void>
  fetchProjectById: (id: number) => Promise<Project | null>
  submitProject: (projectData: Omit<Project, "id" | "customerId" | "status" | "createdAt">) => Promise<Project | null>

  // Proposal methods
  fetchProposals: (projectId?: number) => Promise<void>
  submitProposal: (proposalData: any) => Promise<Proposal | null>
  acceptProposal: (proposalId: number) => Promise<boolean>

  // Message methods
  fetchMessages: (projectId: number) => Promise<void>
  sendMessage: (message: { projectId: number; receiverId: number; content: string }) => Promise<Message | null>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  proposals: [],
  messages: [],
  isLoading: false,
  error: null,
  offlineMode: false,

  fetchProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (!user) {
        set({ projects: [], isLoading: false })
        return
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      if (serverAvailable) {
        // Fetch projects based on user role
        let url = "/api/projects"

        // If user is a customer, only fetch their projects
        if (user.role === "customer") {
          url += `?customerId=${user.id}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch projects")

        const projects = await response.json()
        set({ projects, isLoading: false })
      } else {
        // Use mock data in offline mode
        console.log("Server unavailable, using mock projects")

        // Filter projects based on user role
        let mockProjects = [...MOCK_PROJECTS]
        if (user.role === "customer") {
          mockProjects = mockProjects.filter((project) => project.customerId === user.id)
        }

        set({ projects: mockProjects, isLoading: false })
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      set({
        error: "Unable to fetch projects. Using offline mode.",
        isLoading: false,
        offlineMode: true,
      })

      // Use mock data as fallback
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (user) {
        let mockProjects = [...MOCK_PROJECTS]
        if (user.role === "customer") {
          mockProjects = mockProjects.filter((project) => project.customerId === user.id)
        }

        set({ projects: mockProjects })
      }
    }
  },

  fetchProjectById: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      let project: Project | null = null

      if (serverAvailable) {
        const response = await fetch(`/api/projects/${id}`)
        if (!response.ok) throw new Error("Failed to fetch project")

        project = await response.json()
      } else {
        // Use mock data in offline mode
        console.log("Server unavailable, using mock project")
        project = MOCK_PROJECTS.find((p) => p.id === id) || null
      }

      set({ currentProject: project, isLoading: false })
      return project
    } catch (error) {
      console.error("Error fetching project:", error)
      set({
        error: "Unable to fetch project. Using offline mode.",
        isLoading: false,
        offlineMode: true,
      })

      // Use mock data as fallback
      const project = MOCK_PROJECTS.find((p) => p.id === id) || null
      set({ currentProject: project })
      return project
    }
  },

  submitProject: async (projectData) => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (!user || user.role !== "customer") {
        set({ isLoading: false, error: "Only customers can submit projects" })
        return null
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      const newProject: Omit<Project, "id"> = {
        ...projectData,
        customerId: user.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      if (serverAvailable) {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        })

        if (!response.ok) throw new Error("Failed to submit project")

        const savedProject = await response.json()
        set((state) => ({
          projects: [...state.projects, savedProject],
          isLoading: false,
        }))

        return savedProject
      } else {
        // Create a mock project in offline mode
        const mockProject = {
          id: Math.max(0, ...MOCK_PROJECTS.map((p) => p.id)) + 1,
          ...newProject,
        }

        set((state) => ({
          projects: [...state.projects, mockProject],
          isLoading: false,
        }))

        return mockProject
      }
    } catch (error) {
      console.error("Error submitting project:", error)
      set({
        error: "Failed to submit project",
        isLoading: false,
      })
      return null
    }
  },

  fetchProposals: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      if (serverAvailable) {
        let url = "/api/proposals"
        if (projectId) {
          url += `?projectId=${projectId}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch proposals")

        const proposals = await response.json()
        set({ proposals, isLoading: false })
      } else {
        // Use mock data in offline mode
        console.log("Server unavailable, using mock proposals")

        let mockProposals = [...MOCK_PROPOSALS]
        if (projectId) {
          mockProposals = mockProposals.filter((p) => p.projectId === projectId)
        }

        set({ proposals: mockProposals, isLoading: false })
      }
    } catch (error) {
      console.error("Error fetching proposals:", error)
      set({
        error: "Unable to fetch proposals. Using offline mode.",
        isLoading: false,
        offlineMode: true,
      })

      // Use mock data as fallback
      let mockProposals = [...MOCK_PROPOSALS]
      if (projectId) {
        mockProposals = mockProposals.filter((p) => p.projectId === projectId)
      }

      set({ proposals: mockProposals })
    }
  },

  submitProposal: async (proposalData) => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (!user || user.role !== "admin") {
        set({ isLoading: false, error: "Only admins can submit proposals" })
        return null
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      const newProposal = {
        ...proposalData,
        adminId: user.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      if (serverAvailable) {
        const response = await fetch("/api/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProposal),
        })

        if (!response.ok) throw new Error("Failed to submit proposal")

        const savedProposal = await response.json()
        set((state) => ({
          proposals: [...state.proposals, savedProposal],
          isLoading: false,
        }))

        return savedProposal
      } else {
        // Create a mock proposal in offline mode
        const mockProposal = {
          id: Math.max(0, ...MOCK_PROPOSALS.map((p) => p.id)) + 1,
          ...newProposal,
        }

        set((state) => ({
          proposals: [...state.proposals, mockProposal],
          isLoading: false,
        }))

        return mockProposal
      }
    } catch (error) {
      console.error("Error submitting proposal:", error)
      set({
        error: "Failed to submit proposal",
        isLoading: false,
      })
      return null
    }
  },

  acceptProposal: async (proposalId) => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (!user || user.role !== "customer") {
        set({ isLoading: false, error: "Only customers can accept proposals" })
        return false
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      // Find the proposal
      const proposal = get().proposals.find((p) => p.id === proposalId)
      if (!proposal) {
        set({ isLoading: false, error: "Proposal not found" })
        return false
      }

      // Find the project to ensure the customer owns it
      const project = get().currentProject
      if (!project || project.customerId !== user.id) {
        set({ isLoading: false, error: "You don't have permission to accept this proposal" })
        return false
      }

      const updatedProposal = { ...proposal, status: "accepted" as const }
      const updatedProject = { ...project, status: "in_progress" as const }

      if (serverAvailable) {
        // Update the proposal
        const proposalResponse = await fetch(`/api/proposals/${proposalId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProposal),
        })

        if (!proposalResponse.ok) throw new Error("Failed to update proposal")

        // Update the project status
        const projectResponse = await fetch(`/api/projects/${project.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        })

        if (!projectResponse.ok) throw new Error("Failed to update project")

        // Update local state
        set((state) => ({
          proposals: state.proposals.map((p) => (p.id === proposalId ? updatedProposal : p)),
          currentProject: updatedProject,
          isLoading: false,
        }))

        return true
      } else {
        // Update local state in offline mode
        set((state) => ({
          proposals: state.proposals.map((p) => (p.id === proposalId ? updatedProposal : p)),
          currentProject: updatedProject,
          isLoading: false,
        }))

        return true
      }
    } catch (error) {
      console.error("Error accepting proposal:", error)
      set({
        error: "Failed to accept proposal",
        isLoading: false,
      })
      return false
    }
  },

  fetchMessages: async (projectId) => {
    set({ isLoading: true, error: null })
    try {
      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      if (serverAvailable) {
        console.log(`Fetching messages for project ${projectId}`)
        const response = await fetch(`/api/messages?projectId=${projectId}`)

        if (!response.ok) {
          console.error(`Failed to fetch messages: ${response.status} ${response.statusText}`)
          throw new Error("Failed to fetch messages")
        }

        const messages = await response.json()
        console.log(`Fetched ${messages.length} messages for project ${projectId}`)
        set({ messages, isLoading: false })
      } else {
        // Use mock data in offline mode
        console.log("Server unavailable, using mock messages")
        const mockMessages = MOCK_MESSAGES.filter((m) => m.projectId === projectId)
        set({ messages: mockMessages, isLoading: false })
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      set({
        error: "Unable to fetch messages. Using offline mode.",
        isLoading: false,
        offlineMode: true,
      })

      // Use mock data as fallback
      const mockMessages = MOCK_MESSAGES.filter((m) => m.projectId === projectId)
      set({ messages: mockMessages })
    }
  },

  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const user = authStore.user

      if (!user) {
        set({ isLoading: false, error: "You must be logged in to send messages" })
        return null
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      const newMessage = {
        projectId: messageData.projectId,
        senderId: user.id,
        receiverId: messageData.receiverId,
        content: messageData.content,
      }

      if (serverAvailable) {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newMessage),
        })

        if (!response.ok) throw new Error("Failed to send message")

        const savedMessage = await response.json()
        set((state) => ({
          messages: [...state.messages, savedMessage],
          isLoading: false,
        }))

        return savedMessage
      } else {
        // Create a mock message in offline mode
        const mockMessage = {
          id: Math.max(0, ...MOCK_MESSAGES.map((m) => m.id)) + 1,
          projectId: messageData.projectId,
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          receiverId: messageData.receiverId,
          content: messageData.content,
          createdAt: new Date().toISOString(),
          read: false,
        }

        set((state) => ({
          messages: [...state.messages, mockMessage],
          isLoading: false,
        }))

        return mockMessage
      }
    } catch (error) {
      console.error("Error sending message:", error)
      set({
        error: "Failed to send message",
        isLoading: false,
      })
      return null
    }
  },
}))

