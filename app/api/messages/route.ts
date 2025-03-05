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
    return { messages: [], users: [] }
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

// GET /api/messages?projectId=123
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const db = readDB()

    let messages = db.messages || []

    if (projectId) {
      const projectIdNum = Number.parseInt(projectId)
      messages = messages.filter((message: any) => message.projectId === projectIdNum)
      console.log(`Found ${messages.length} messages for project ${projectIdNum}`)
    }

    return NextResponse.json(messages, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

// POST /api/messages
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, senderId, receiverId, content } = body

    if (!projectId || !senderId || !receiverId || !content) {
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

    // Get sender info
    const users = db.users || []
    const sender = users.find((user: any) => user.id === senderId)

    if (!sender) {
      return NextResponse.json(
        { error: "Sender not found" },
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    const newMessage = {
      id: Date.now(),
      projectId,
      senderId,
      senderName: sender.name,
      senderRole: sender.role,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    }

    db.messages = [...(db.messages || []), newMessage]

    writeDB(db)

    return NextResponse.json(newMessage, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

