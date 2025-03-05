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
    return { proposals: [] }
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

// GET /api/proposals?projectId=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const db = readDB()

    let proposals = db.proposals || []

    if (projectId) {
      proposals = proposals.filter((proposal: any) => proposal.projectId === Number.parseInt(projectId))
    }

    return NextResponse.json(proposals, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// POST /api/proposals
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, adminId, title, description, price, timeline, deliverables } = body

    if (!projectId || !adminId || !title || !description || !price || !timeline || !deliverables) {
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

    const newProposal = {
      id: Date.now(),
      projectId,
      adminId,
      title,
      description,
      price,
      timeline,
      deliverables,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    db.proposals = [...(db.proposals || []), newProposal]

    writeDB(db)

    return NextResponse.json(newProposal, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json(
      { error: "Failed to create proposal" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

