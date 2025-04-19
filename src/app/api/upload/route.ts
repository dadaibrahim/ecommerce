import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuidv4()}-${file.name.replaceAll(" ", "_")}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  await writeFile(filePath, buffer);

  const imageUrl = `/uploads/${filename}`;

  return NextResponse.json({ url: imageUrl });
}
