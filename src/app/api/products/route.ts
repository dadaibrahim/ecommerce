import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch all products or one by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const [rows]: any = await db.query("SELECT * FROM products WHERE id = ?", [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    } else {
      const [rows]: any = await db.query("SELECT * FROM products");
      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Add new product
export async function POST(request: Request) {
  try {
    const { name, description, price, stock, image } = await request.json();
    const [result]: any = await db.query(
      "INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, stock, image]
    );
    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// PUT: Update product by ID
export async function PUT(request: Request) {
  try {
    const { id, name, description, price, stock, image } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const [result]: any = await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?",
      [name, description, price, stock, image, id]
    );

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Delete product by ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const [result]: any = await db.query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
