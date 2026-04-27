import { clearSession } from "@/lib/auth/sessions";
import { ok } from "@/lib/api";

export async function POST(): Promise<Response> {
  await clearSession();
  return ok({ message: "Signed out." });
}
