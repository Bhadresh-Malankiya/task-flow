"use client"

import { useStore } from "@/store/store"
import type { Task } from "@/types/task"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const { toggleTaskCompletion, deleteTask } = useStore()

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No tasks found. Add a new task to get started.</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTaskCompletion(task.id)}
              id={`task-${task.id}`}
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

