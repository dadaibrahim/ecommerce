import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // Fetch a single product by ID
      const [rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } else {
      // Fetch all products
      const [rows] = await db.query("SELECT * FROM products");
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, price, stock, image_url } = await request.json();
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, image_url]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
