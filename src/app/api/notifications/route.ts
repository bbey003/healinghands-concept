import { ok, unauthorized, serverError } from "@/lib/api";
import { notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

export async function GET(): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const notifications = notificationsRepo.listForUser(session.user_id);
    return ok({ notifications });
  } catch (e) {
    return serverError(e);
  }
}
