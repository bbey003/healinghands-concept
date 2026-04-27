import { NextRequest } from "next/server";
import { ok, serverError } from "@/lib/api";
import { usersRepo, tokensRepo } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json() as unknown;
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return ok({ message: "If that email exists, a link was sent." });

    const user = usersRepo.findByEmail(parsed.data.email);
    if (user) {
      const token = tokensRepo.create(user.id, "password_reset");
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      console.log(`[reset] ${baseUrl}/reset-password?token=${token}`);
    }

    return ok({ message: "If that email exists, a reset link has been sent." });
  } catch (e) {
    return serverError(e);
  }
}
