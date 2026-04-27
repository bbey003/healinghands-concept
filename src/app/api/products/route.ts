import { productsRepo } from "@/lib/db";
import { ok } from "@/lib/api";

export async function GET(): Promise<Response> {
  const products = productsRepo.listActive();
  return ok({ products });
}
