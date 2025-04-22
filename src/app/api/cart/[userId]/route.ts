import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { cookies } from "next/headers";

// Fetch cart items for a user
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    // Query to fetch cart items for the user
    const [cartItems]: any = await db.query(
      `SELECT ci.id, p.name, p.price, ci.quantity, p.image AS image_url 
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return NextResponse.json([], { status: 200 }); // Empty cart response
    }

    return NextResponse.json(cartItems, { status: 200 });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add product to cart or update quantity if already exists
export async function POST(req: Request) {
  const { productId, quantity } = await req.json();

  try {
    const sessionToken = cookies().get('sessionToken')?.value;
    if (!sessionToken) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }

    // Get user ID from session
    const [[session]] = await db.query(
      "SELECT user_id FROM sessions WHERE session_token = ? AND expires_at > NOW()",
      [sessionToken]
    );

    if (!session) {
      return NextResponse.json({ message: "Session expired or not found" }, { status: 401 });
    }

    const userId = session.user_id;

    // Check if user already has a cart (if not, create one)
    const [[existingCart]] = await db.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [userId]
    );

    let cartId = existingCart ? existingCart.id : null;

    if (!cartId) {
      const [result] = await db.query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId]
      );
      cartId = result.insertId;
    }

    // Add product to cart or update quantity if already exists
    await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [cartId, productId, quantity, quantity]
    );

    return NextResponse.json({ message: "Product added to cart" }, { status: 200 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update cart item quantity
export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  const { itemId, quantity } = await req.json();
  const userId = params.userId;

  try {
    // Update cart item quantity
    const [result] = await db.query(
      `UPDATE cart_items 
       SET quantity = ? 
       WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?) 
       AND product_id = ?`,
      [quantity, userId, itemId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Item not found or already updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quantity updated" }, { status: 200 });
  } catch (err) {
    console.error("Error updating cart item:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Remove cart item
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  const url = new URL(req.url);
  const itemId = url.searchParams.get('itemId');  // This will refer to the id of the cart item
  const userId = params.userId;

  // Validate itemId and userId
  if (!itemId || !userId) {
    return NextResponse.json({ error: 'Missing itemId or userId' }, { status: 400 });
  }

  try {
    // Remove the item from the cart based on cart_items.id
    const [result] = await db.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?) 
       AND id = ?`,
      [userId, itemId]  // Use itemId as the primary key
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Item not found or already removed from cart' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (err) {
    console.error('Error removing cart item:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
