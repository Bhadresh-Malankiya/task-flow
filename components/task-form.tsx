"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/store/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TaskFormProps {
  onComplete: () => void
}

export function TaskForm({ onComplete }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const { addTask } = useStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(title)
      setTitle("")
      onComplete()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </div>
    </form>
  )
}

