import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    const [rows] = await db.query(
      `SELECT ci.id, ci.quantity, p.name, p.price, p.image_url 
       FROM cart_items ci 
       JOIN carts c ON ci.cart_id = c.id 
       JOIN products p ON ci.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /cart error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    const { productId, quantity } = await request.json();

    const [[cart]] = await db.query("SELECT id FROM carts WHERE user_id = ?", [userId]);
    const cartId = cart?.id || (
      await db.query("INSERT INTO carts (user_id) VALUES (?)", [userId])
    )[0].insertId;

    await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [cartId, productId, quantity, quantity]
    );

    return NextResponse.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("POST /cart error:", error);
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}
