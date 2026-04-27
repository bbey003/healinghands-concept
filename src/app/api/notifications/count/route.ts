import { ok, unauthorized } from "@/lib/api";
import { notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();
  const count = notificationsRepo.countUnread(session.user_id);
  return ok({ count });
}
