import { cookies } from "next/headers";
import type { Session, UserRole } from "@/types";

const COOKIE_NAME = "hh_session";
const SECRET = process.env.SESSION_SECRET ?? "healing-hands-dev-secret-32chars!";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function encode(payload: Session): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  // Simple HMAC-like signature using secret (not production-grade, fine for demo)
  const sig = Buffer.from(
    require("crypto")
      .createHmac("sha256", SECRET)
      .update(b64)
      .digest("hex"),
  ).toString("base64url");
  return `${b64}.${sig}`;
}

function decode(token: string): Session | null {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;
    const expected = Buffer.from(
      require("crypto")
        .createHmac("sha256", SECRET)
        .update(b64)
        .digest("hex"),
    ).toString("base64url");
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(b64, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return decode(token);
}

export async function setSession(session: Session): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, encode(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function requireSession(
  allowedRoles?: UserRole[],
): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
