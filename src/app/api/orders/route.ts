import { ok, unauthorized, serverError } from "@/lib/api";
import { ordersRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

export async function GET(): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const orders =
      session.role === "admin" || session.role === "moderator"
        ? ordersRepo.listAll()
        : ordersRepo.listByUser(session.user_id);

    return ok({ orders });
  } catch (e) {
    return serverError(e);
  }
}
