import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Create a session (POST)
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const [users]: any = await db.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    const user = users[0];
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const sessionToken = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour

    await db.query(
      `INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        sessionToken,
        req.headers.get("x-forwarded-for") || null,
        req.headers.get("user-agent") || null,
        expiresAt,
        now, // explicitly insert created_at
      ]
    );

    const response = NextResponse.json(
      { success: true, userId: user.id, name: user.name },
      { status: 201 }
    );

    response.cookies.set("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("userName", user.name, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get user_id by sessionToken (GET)
export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("sessionToken")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "No session token found" }, { status: 401 });
    }

    const [rows]: any = await db.query(
      "SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()",
      [sessionToken]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Session not found or expired" }, { status: 401 });
    }

    const userId = rows[0].user_id;

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    console.error("Error getting session user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
