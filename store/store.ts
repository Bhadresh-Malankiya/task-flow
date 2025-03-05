"use client"

import { create } from "zustand"
import type { Task } from "@/types/task"
import { useAuthStore } from "@/store/auth-store"

// Mock tasks for offline mode
const MOCK_TASKS = [
  {
    id: 1,
    title: "Learn Next.js",
    completed: true,
    userId: 1,
  },
  {
    id: 2,
    title: "Build a project with Tailwind CSS",
    completed: false,
    userId: 1,
  },
  {
    id: 3,
    title: "Implement Zustand for state management",
    completed: false,
    userId: 2,
  },
  {
    id: 4,
    title: "Create user authentication system",
    completed: true,
    userId: 3,
  },
  {
    id: 5,
    title: "Design responsive UI",
    completed: false,
    userId: 2,
  },
]

interface StoreState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  offlineMode: boolean
  fetchTasks: () => Promise<void>
  addTask: (title: string) => Promise<void>
  toggleTaskCompletion: (id: number) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

// Check if the server is available
const isServerAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout

    const response = await fetch("http://localhost:3001/tasks", {
      method: "HEAD",
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.warn("Server check failed:", error)
    return false
  }
}

export const useStore = create<StoreState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  offlineMode: false,

  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const userId = authStore.user?.id

      // If not logged in, return empty tasks
      if (!userId) {
        set({ tasks: [], isLoading: false })
        return
      }

      // Check if server is available
      const serverAvailable = await isServerAvailable()
      set({ offlineMode: !serverAvailable })

      if (serverAvailable) {
        // Fetch tasks for the current user from db.json
        const response = await fetch(`http://localhost:3001/tasks?userId=${userId}`)
        if (!response.ok) throw new Error("Failed to fetch tasks")
        const tasks = await response.json()
        set({ tasks, isLoading: false })
      } else {
        // Use mock data in offline mode
        console.log("Server unavailable, using mock tasks")
        const mockUserTasks = MOCK_TASKS.filter((task) => task.userId === userId)
        set({ tasks: mockUserTasks, isLoading: false })
      }
    } catch (error) {
      set({
        error: "Unable to fetch tasks. Using offline mode.",
        isLoading: false,
        offlineMode: true,
      })

      // Use mock data as fallback
      const authStore = useAuthStore.getState()
      const userId = authStore.user?.id

      if (userId) {
        const mockUserTasks = MOCK_TASKS.filter((task) => task.userId === userId)
        set({ tasks: mockUserTasks })
      }

      console.error("Error fetching tasks:", error)
    }
  },

  addTask: async (title: string) => {
    set({ isLoading: true, error: null })
    try {
      // Get the current user ID from auth store
      const authStore = useAuthStore.getState()
      const userId = authStore.user?.id

      // If not logged in, don't add task
      if (!userId) {
        set({ isLoading: false, error: "User not authenticated" })
        return
      }

      const newTask = {
        id: Date.now(),
        title,
        completed: false,
        userId,
      }

      // Check if in offline mode
      if (get().offlineMode) {
        // Just add to local state in offline mode
        set((state) => ({
          tasks: [...state.tasks, newTask],
          isLoading: false,
        }))
        return
      }

      // Add task to db.json
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) throw new Error("Failed to add task")
      const savedTask = await response.json()

      set((state) => ({
        tasks: [...state.tasks, savedTask],
        isLoading: false,
      }))
    } catch (error) {
      // Handle error but still add task to local state
      const authStore = useAuthStore.getState()
      const userId = authStore.user?.id

      if (userId) {
        const newTask = {
          id: Date.now(),
          title,
          completed: false,
          userId,
        }

        set((state) => ({
          tasks: [...state.tasks, newTask],
          isLoading: false,
          error: "Added task in offline mode",
          offlineMode: true,
        }))
      } else {
        set({
          error: "Failed to add task",
          isLoading: false,
        })
      }

      console.error("Error adding task:", error)
    }
  },

  toggleTaskCompletion: async (id: number) => {
    const task = get().tasks.find((t) => t.id === id)
    if (!task) return

    set({ isLoading: true, error: null })
    try {
      // Update local state immediately for better UX
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      }))

      // If in offline mode, just keep the local state update
      if (get().offlineMode) {
        set({ isLoading: false })
        return
      }

      // Update task in db.json
      const updatedTask = { ...task, completed: !task.completed }
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) throw new Error("Failed to update task")

      set({ isLoading: false })
    } catch (error) {
      set({
        error: "Updated task in offline mode",
        isLoading: false,
        offlineMode: true,
      })
      console.error("Error updating task:", error)
    }
  },

  deleteTask: async (id: number) => {
    set({ isLoading: true, error: null })
    try {
      // Update local state immediately for better UX
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }))

      // If in offline mode, just keep the local state update
      if (get().offlineMode) {
        set({ isLoading: false })
        return
      }

      // Delete task from db.json
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      set({ isLoading: false })
    } catch (error) {
      set({
        error: "Deleted task in offline mode",
        isLoading: false,
        offlineMode: true,
      })
      console.error("Error deleting task:", error)
    }
  },
}))

