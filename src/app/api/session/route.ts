// src/app/api/sessions/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Create a session (POST)
export async function POST(req: NextRequest) {
  try {
    const { userId, sessionToken, ipAddress, userAgent, expiresAt } = await req.json();

    const [result]: any = await db.query(
      `INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, sessionToken, ipAddress, userAgent, expiresAt]
    );

    return NextResponse.json({ sessionId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all sessions (GET)
export async function GET() {
  try {
    const [rows]: any = await db.query(`SELECT * FROM sessions`);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
