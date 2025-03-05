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

// GET /api/projects/123
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const db = readDB()

    const project = (db.projects || []).find((p: any) => p.id === id)

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return NextResponse.json(project, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// PUT /api/projects/123
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const db = readDB()

    const projectIndex = (db.projects || []).findIndex((p: any) => p.id === id)

    if (projectIndex === -1) {
      return NextResponse.json(
        { error: "Project not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Update the project
    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...body,
    }

    writeDB(db)

    return NextResponse.json(db.projects[projectIndex], {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

