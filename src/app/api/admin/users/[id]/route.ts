import { NextRequest } from "next/server";
import { ok, err, unauthorized, forbidden, notFound, serverError } from "@/lib/api";
import { usersRepo, auditRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    if (session.role !== "admin" && session.role !== "moderator") return forbidden();

    const { id } = await params;
    const target = usersRepo.findById(id);
    if (!target) return notFound("User");

    const body = (await req.json()) as { status?: string; role?: string };
    const patch: Record<string, string> = {};
    if (body.status && ["active", "suspended"].includes(body.status)) patch.status = body.status;
    if (body.role && session.role === "admin" && ["user", "provider", "moderator", "admin"].includes(body.role)) {
      patch.role = body.role;
    }

    if (Object.keys(patch).length === 0) return err("No valid fields to update.");

    const updated = usersRepo.update(id, patch as Parameters<typeof usersRepo.update>[1]);
    auditRepo.log({
      user_id: session.user_id,
      action: "admin.update_user",
      target_type: "user",
      target_id: id,
      metadata: patch,
      ip: req.headers.get("x-forwarded-for"),
    });

    return ok({ user: updated });
  } catch (e) {
    return serverError(e);
  }
}
