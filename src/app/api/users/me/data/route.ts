import { ok, unauthorized } from "@/lib/api";
import { usersRepo, bookingsRepo, ordersRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

export async function GET(): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();

  const user = usersRepo.findById(session.user_id);
  const bookings = bookingsRepo.listByUser(session.user_id);
  const orders = ordersRepo.listByUser(session.user_id);

  return ok({ user, bookings, orders });
}

export async function DELETE(): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();

  // Anonymize the user record rather than hard-delete, to preserve booking/order integrity
  usersRepo.update(session.user_id, {
    email: `deleted-${session.user_id}@deleted.invalid`,
    display_name: "Deleted User",
    avatar_url: "",
    status: "suspended",
  });

  const { clearSession } = await import("@/lib/auth/sessions");
  await clearSession();

  return ok({ message: "Account data has been removed." });
}
