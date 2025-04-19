import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Import bcryptjs for hashing

export async function GET() {
  try {
    const [users]: any = await db.query("SELECT id, name, email FROM users");
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Hash the password before storing it in the database
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const [result]: any = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    return NextResponse.json({ id: result.insertId, name, email }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
