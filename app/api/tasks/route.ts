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

// GET /api/tasks?projectId=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const assignedTo = searchParams.get("assignedTo")

    const db = readDB()
    let tasks = db.tasks || []

    if (projectId) {
      tasks = tasks.filter((task: any) => task.projectId === Number.parseInt(projectId))
    }

    if (assignedTo) {
      tasks = tasks.filter((task: any) => task.assignedTo === Number.parseInt(assignedTo))
    }

    return NextResponse.json(tasks, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// POST /api/tasks
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, title, description, assignedTo, status, priority } = body

    if (!projectId || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const db = readDB()

    const newTask = {
      id: Date.now(),
      projectId,
      title,
      description,
      assignedTo,
      status: status || "pending",
      priority: priority || "medium",
      createdAt: new Date().toISOString(),
    }

    db.tasks = [...(db.tasks || []), newTask]

    writeDB(db)

    return NextResponse.json(newTask, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

