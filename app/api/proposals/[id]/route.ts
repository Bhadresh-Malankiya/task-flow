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
    return { proposals: [], projects: [] }
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

// GET /api/proposals/123
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const db = readDB()

    const proposal = (db.proposals || []).find((p: any) => p.id === id)

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    return NextResponse.json(proposal, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching proposal:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// PUT /api/proposals/123
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    const db = readDB()

    const proposalIndex = (db.proposals || []).findIndex((p: any) => p.id === id)

    if (proposalIndex === -1) {
      return NextResponse.json(
        { error: "Proposal not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Update the proposal
    db.proposals[proposalIndex] = {
      ...db.proposals[proposalIndex],
      ...body,
    }

    // If the proposal is being accepted, also update the project status
    if (body.status === "accepted") {
      const projectId = db.proposals[proposalIndex].projectId
      const projectIndex = (db.projects || []).findIndex((p: any) => p.id === projectId)

      if (projectIndex !== -1) {
        db.projects[projectIndex] = {
          ...db.projects[projectIndex],
          status: "in_progress",
          acceptedProposalId: id,
        }
      }
    }

    writeDB(db)

    return NextResponse.json(db.proposals[proposalIndex], {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error updating proposal:", error)
    return NextResponse.json(
      { error: "Failed to update proposal" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

