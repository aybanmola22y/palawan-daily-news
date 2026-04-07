import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const DEMO_USERS = [
  { id: 1, name: "Admin User", email: "admin@palawandaily.com", password: "admin123", role: "super_admin" },
  { id: 2, name: "Elena Reyes", email: "editor@palawandaily.com", password: "editor123", role: "editor" },
  { id: 3, name: "Maria Santos", email: "writer@palawandaily.com", password: "writer123", role: "writer" },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        // Fetch profile to get the role (try authors first, then profiles)
        let { data: profile } = await supabase
          .from("authors")
          .select("role, name")
          .eq("id", data.user.id)
          .single();

        if (!profile) {
          const { data: p } = await supabase
            .from("profiles")
            .select("role, name")
            .eq("id", data.user.id)
            .single();
          profile = p;
        }

        const sessionData = JSON.stringify({
          id: data.user.id,
          name: profile?.name || data.user.email?.split("@")[0],
          email: data.user.email,
          role: profile?.role || "writer",
        });

        const cookieStore = await cookies();
        cookieStore.set("session", Buffer.from(sessionData).toString("base64"), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return NextResponse.json({ 
          success: true, 
          user: { name: profile?.name || data.user.email, role: profile?.role || "writer" } 
        });
      }
      
      // If Supabase is configured but login fails, return error immediately
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
    }

    // 2. Fallback to Mock Users for development
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
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
