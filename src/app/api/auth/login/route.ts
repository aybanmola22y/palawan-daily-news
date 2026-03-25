import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEMO_USERS = [
  { id: 1, name: "Admin User", email: "admin@palawandaily.com", password: "admin123", role: "super_admin" },
  { id: 2, name: "Elena Reyes", email: "editor@palawandaily.com", password: "editor123", role: "editor" },
  { id: 3, name: "Maria Santos", email: "writer@palawandaily.com", password: "writer123", role: "writer" },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const sessionData = JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    cookieStore.set("session", Buffer.from(sessionData).toString("base64"), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
