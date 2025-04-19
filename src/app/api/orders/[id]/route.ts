// app/api/orders/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const orderId = params.id;

    await db.query("UPDATE orders SET status = ? WHERE id = ?", [status, orderId]);

    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
