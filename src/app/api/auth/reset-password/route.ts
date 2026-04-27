import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { usersRepo, tokensRepo } from "@/lib/db";
import { hashPassword } from "@/lib/auth/passwords";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json() as unknown;
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { token, password } = parsed.data;
    const userId = tokensRepo.consume(token, "password_reset");
    if (!userId) return err("Reset link is invalid or has expired.");

    const hash = await hashPassword(password);
    usersRepo.updatePasswordHash(userId, hash);

    return ok({ message: "Password updated." });
  } catch (e) {
    return serverError(e);
  }
}
