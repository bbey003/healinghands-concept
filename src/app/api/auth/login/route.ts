import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { usersRepo } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/passwords";
import { setSession } from "@/lib/auth/sessions";
import { checkRateLimit } from "@/lib/auth/rate-limit";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const { allowed } = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!allowed) return err("Too many login attempts. Try again in 15 minutes.", 429);

    const body = await req.json() as unknown;
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return err("Invalid email or password.");

    const { email, password } = parsed.data;
    const user = usersRepo.findByEmail(email);
    if (!user) return err("Invalid email or password.");
    if (user.status === "suspended") return err("This account has been suspended.");

    const hash = usersRepo.getPasswordHash(user.id);
    if (!hash) return err("Invalid email or password.");

    const valid = await verifyPassword(password, hash);
    if (!valid) return err("Invalid email or password.");

    usersRepo.update(user.id, { last_sign_in_at: new Date().toISOString() });
    await setSession({ user_id: user.id, role: user.role });

    return ok({
      user: { id: user.id, email: user.email, display_name: user.display_name, role: user.role, avatar_url: user.avatar_url },
    });
  } catch (e) {
    return serverError(e);
  }
}
