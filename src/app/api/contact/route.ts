import { NextRequest } from "next/server";
import { ok, err, serverError } from "@/lib/api";
import { contactSchema } from "@/lib/validation";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json() as unknown;
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { name, email, message } = parsed.data;
    console.log(`[contact] From: ${name} <${email}>\n${message}`);

    return ok({ message: "Message received. We'll be in touch within one business day." });
  } catch (e) {
    return serverError(e);
  }
}
