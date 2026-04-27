import { NextRequest } from "next/server";
import { ok, err, unauthorized, serverError } from "@/lib/api";
import { productsRepo, ordersRepo, notificationsRepo } from "@/lib/db";
import { getSession } from "@/lib/auth/sessions";
import { checkoutSchema } from "@/lib/validation";
import { calcTax, calcShipping } from "@/lib/utils";
import type { OrderItem } from "@/types";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json() as unknown;
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Invalid input");

    const { items, shipping_address, payment_intent_id } = parsed.data;

    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productsRepo.findById(item.product_id);
      if (!product || !product.is_active) return err(`Product ${item.product_id} not found.`);

      const variant = item.variant_id
        ? product.variants.find((v) => v.id === item.variant_id)
        : null;

      const price_cents = variant?.price_cents ?? product.price_cents;
      const ok_stock = productsRepo.decrementStock(
        item.product_id,
        item.variant_id ?? null,
        item.quantity,
      );
      if (!ok_stock) return err(`${product.name} is out of stock.`);

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id ?? null,
        name: product.name + (variant ? ` (${variant.name})` : ""),
        quantity: item.quantity,
        price_cents,
      });
      subtotal += price_cents * item.quantity;
    }

    const tax = calcTax(subtotal);
    const shipping = calcShipping(subtotal);

    const order = ordersRepo.create({
      user_id: session.user_id,
      items: orderItems,
      subtotal_cents: subtotal,
      tax_cents: tax,
      shipping_cents: shipping,
      stripe_payment_intent_id: payment_intent_id,
      shipping_address,
    });

    notificationsRepo.create({
      user_id: session.user_id,
      type: "order_placed",
      title: "Order confirmed",
      body: `Your order of ${orderItems.length} item(s) has been placed.`,
      action_url: "/dashboard/orders",
      image_url: null,
      data: { order_id: order.id },
      is_read: false,
      read_at: null,
      is_dismissed: false,
    });

    return ok({ order }, 201);
  } catch (e) {
    return serverError(e);
  }
}
