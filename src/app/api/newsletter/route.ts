import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { newsletterSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json() as unknown;
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) return err("Invalid email address.");

    console.log(`[newsletter] Subscribed: ${parsed.data.email}`);
    return ok({ message: "Subscribed!" });
  } catch (e) {
    return serverError(e);
  }
}
