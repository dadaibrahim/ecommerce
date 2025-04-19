import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Ensure bcrypt is installed
import crypto from "crypto"; // Native module for token generation
import Cookies from 'js-cookie'; // Make sure js-cookie is imported properly

// Create a session (POST)
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Get user from DB
    const [users]: any = await db.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    const user = users[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare password using bcrypt
    const passwordIsValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate a secure session token
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Insert session into the database
    await db.query(
      `INSERT INTO sessions (user_id, session_token, ip_address, user_agent, expires_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        user.id,
        sessionToken,
        req.headers.get("x-forwarded-for") || null,
        req.headers.get("user-agent") || null,
        expiresAt,
      ]
    );

    // After successfully creating the session, set the cookies here
    Cookies.set('sessionToken', sessionToken, { expires: 1 });
    Cookies.set('userName', user.name, { expires: 1 });

    return NextResponse.json(
      { sessionToken, userId: user.id, name: user.name },
      { status: 201 }
    );
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
