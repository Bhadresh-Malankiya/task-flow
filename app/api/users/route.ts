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
    return { users: [] }
  }
}

// GET /api/users?role=admin
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const ids = searchParams.get("ids")

    const db = readDB()

    let users = db.users || []

    // Filter by role if provided
    if (role) {
      users = users.filter((user: any) => user.role === role)
    }

    // Filter by IDs if provided
    if (ids) {
      const idArray = ids.split(",").map(Number)
      users = users.filter((user: any) => idArray.includes(user.id))
    }

    // Remove sensitive information
    users = users.map((user: any) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(users, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

