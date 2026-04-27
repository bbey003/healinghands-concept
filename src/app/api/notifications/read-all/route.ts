import { ok, unauthorized } from "@/lib/api";
import { notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

export async function POST(): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();
  notificationsRepo.markAllRead(session.user_id);
  return ok({ message: "All marked as read." });
}
