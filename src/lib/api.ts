import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function err(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function unauthorized(): NextResponse {
  return err("Unauthorized", 401);
}

export function forbidden(): NextResponse {
  return err("Forbidden", 403);
}

export function notFound(what = "Resource"): NextResponse {
  return err(`${what} not found`, 404);
}

export function serverError(e?: unknown): NextResponse {
  console.error(e);
  return err("Internal server error", 500);
}
