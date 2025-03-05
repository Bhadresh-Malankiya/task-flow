import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Helper function to read the database
function readDB() {
  try {
    const dbPath = path.join(process.cwd(), "db.json")
    const dbData = fs.readFileSync(dbPath, "utf8")
    return JSON.parse(dbData)
  } catch (error) {
    console.error("Error reading database:", error)
    return { tasks: [] }
  }
}

// Helper function to write to the database
function writeDB(data: any) {
  try {
    const dbPath = path.join(process.cwd(), "db.json")
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8")
  } catch (error) {
    console.error("Error writing to database:", error)
  }
}

// GET /api/tasks/123
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const db = readDB()

    const task = (db.tasks || []).find((t: any) => t.id === id)

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return NextResponse.json(task, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Failed to fetch task" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// PUT /api/tasks/123
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const db = readDB()

    const taskIndex = (db.tasks || []).findIndex((t: any) => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Update the task
    db.tasks[taskIndex] = {
      ...db.tasks[taskIndex],
      ...body,
    }

    writeDB(db)

    return NextResponse.json(db.tasks[taskIndex], {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// DELETE /api/tasks/123
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const db = readDB()

    const taskIndex = (db.tasks || []).findIndex((t: any) => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Remove the task
    db.tasks.splice(taskIndex, 1)

    writeDB(db)

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

