import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const user = JSON.parse(Buffer.from(sessionCookie, "base64").toString());
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
