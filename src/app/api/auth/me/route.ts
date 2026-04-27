import { getSession } from "@/lib/auth/sessions";
import { usersRepo } from "@/lib/db";
import { ok, unauthorized } from "@/lib/api";

export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();
  const user = usersRepo.findById(session.user_id);
  if (!user) return unauthorized();
  return ok({
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      role: user.role,
      email_verified_at: user.email_verified_at,
    },
  });
}
