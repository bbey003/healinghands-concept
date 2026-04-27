import { NextRequest } from "next/server";
import { ok, unauthorized } from "@/lib/api";
import { notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";

interface Params { params: Promise<{ id: string }> }

export async function PATCH(_req: NextRequest, { params }: Params): Promise<Response> {
  const session = await getSession();
  if (!session) return unauthorized();
  const { id } = await params;
  notificationsRepo.markRead(id);
  return ok({ message: "Marked as read." });
}
