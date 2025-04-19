// order/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [orders] = await db.query("SELECT * FROM orders ORDER BY created_at DESC");

    const orderIds = orders.map((order: any) => order.id);

    if (orderIds.length === 0) {
      return NextResponse.json([]);
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name as product_name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const orderMap = new Map();
    for (const order of orders) {
      orderMap.set(order.id, { ...order, items: [] });
    }

    for (const item of items) {
      orderMap.get(item.order_id).items.push({
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return NextResponse.json(Array.from(orderMap.values()));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
