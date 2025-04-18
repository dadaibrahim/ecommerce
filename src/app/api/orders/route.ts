import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, items } = await request.json();

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    const [orderResult]: any = await db.query(
      "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      [userId, total]
    );
    const orderId = orderResult.insertId;

    const orderItemsData = items.map(
      (item: { productId: number; quantity: number; price: number }) => [
        orderId,
        item.productId,
        item.quantity,
        item.price,
      ]
    );

    await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
      [orderItemsData]
    );

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Use POST to place an order." }, { status: 405 });
}
