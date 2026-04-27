import { servicesRepo, usersRepo } from "@/lib/db";
import { ok } from "@/lib/api";

export async function GET(): Promise<Response> {
  const services = servicesRepo.listActive().map((s) => ({
    ...s,
    provider: usersRepo.findPublicById(s.provider_id),
  }));
  return ok({ services });
}
