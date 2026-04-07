import { NextResponse } from "next/server";
import { getAuthors } from "@/lib/articles-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authors = await getAuthors();
    return NextResponse.json(authors);
  } catch (error) {
    console.error("API Authors GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}
