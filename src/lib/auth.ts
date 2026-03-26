import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";


import { supabase, isSupabaseConfigured } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || "palawan-daily-news-secret-2024";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string | number): Promise<string> {
  const sessionId = uuidv4();
  // If Supabase is configured, you'd typically use supabase.auth.signInWithPassword
  // and manage the session via their helpers. For now, we return a local ID.
  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) return null;

  if (isSupabaseConfigured) {
    try {
      // Basic check: if you use Supabase Auth, you'd get the user like this:
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        return {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          role: user.user_metadata?.role || "writer"
        };
      }
    } catch (e) {
      console.error("Supabase getSession error:", e);
    }
  }
  
  // Return null if no session found (local or Supabase)
  return null;
}


export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (sessionId) {
    // await supabase.from('sessions').delete().eq('id', sessionId)
  }
}


export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
