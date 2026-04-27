import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { usersRepo, tokensRepo } from "@/lib/db";
import { hashPassword } from "@/lib/auth/passwords";
import { setSession } from "@/lib/auth/sessions";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { registerSchema } from "@/lib/validation";
import { generateId } from "@/lib/db/store";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const { allowed } = checkRateLimit(`register:${ip}`, 3, 60 * 60 * 1000);
    if (!allowed) return err("Too many registration attempts. Try again later.", 429);

    const body = await req.json() as unknown;
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { email, password, display_name } = parsed.data;
    if (usersRepo.findByEmail(email)) return err("An account with this email already exists.");

    const password_hash = await hashPassword(password);
    const user = usersRepo.create({
      id: generateId(),
      email,
      display_name,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(display_name)}`,
      role: "user",
      status: "active",
      email_verified_at: null,
      last_sign_in_at: new Date().toISOString(),
      password_hash,
    });

    // Email verification (logs to console in dev)
    const token = tokensRepo.create(user.id, "email_verification");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    console.log(`[verify] ${baseUrl}/verify-email?token=${token}`);

    await setSession({ user_id: user.id, role: user.role });
    return ok({ user: { id: user.id, email: user.email, display_name: user.display_name, role: user.role } }, 201);
  } catch (e) {
    return serverError(e);
  }
}
