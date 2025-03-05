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
    return { projects: [] }
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

// GET /api/projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")

    const db = readDB()
    let projects = db.projects || []

    if (customerId) {
      projects = projects.filter((project: any) => project.customerId === Number.parseInt(customerId))
    }

    // Ensure we're returning JSON with proper headers
    return NextResponse.json(projects, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, budget, description, timeline, goals, customerId } = body

    if (!name || !budget || !description || !timeline || !goals || !customerId) {
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

    const newProject = {
      id: Date.now(),
      name,
      budget,
      description,
      timeline,
      goals,
      status: "pending",
      customerId,
      createdAt: new Date().toISOString(),
    }

    db.projects = [...(db.projects || []), newProject]

    writeDB(db)

    return NextResponse.json(newProject, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

