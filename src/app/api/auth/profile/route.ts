import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/sessions";
import { usersRepo } from "@/lib/db";
import { ok, unauthorized, serverError, err } from "@/lib/api";
import { profileSchema } from "@/lib/validation";

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json() as unknown;
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const user = usersRepo.update(session.user_id, parsed.data);
    if (!user) return err("User not found", 404);

    return ok({ user: { id: user.id, display_name: user.display_name, avatar_url: user.avatar_url } });
  } catch (e) {
    return serverError(e);
  }
}
