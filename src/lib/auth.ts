import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";


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

// Placeholder for Supabase auth or database logic
// TODO: Implement Supabase session management
export async function createSession(userId: number): Promise<string> {
  const sessionId = uuidv4();
  // const { data, error } = await supabase.from('sessions').insert({ id: sessionId, user_id: userId, expires_at: ... })
  return sessionId;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) return null;

  // Placeholder for Supabase query
  // const { data: session } = await supabase.from('sessions').select('*, user:users(*)').eq('id', sessionId).single()
  
  // Return a mock user for now to prevent breaking the UI if needed, 
  // or return null if you want to force login.
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
