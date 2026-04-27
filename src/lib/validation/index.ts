import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  display_name: z.string().min(2).max(80),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  display_name: z.string().min(2).max(80).optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export const bookingHoldSchema = z.object({
  service_id: z.string().min(1),
  start_at: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T/)),
});

export const bookingCreateSchema = z.object({
  service_id: z.string().min(1),
  start_at: z.string().min(1),
  notes: z.string().max(500).optional().default(""),
  payment_intent_id: z.string().min(1),
});

export const cancelSchema = z.object({
  reason: z.string().max(500).optional().default(""),
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.string(),
      variant_id: z.string().nullable().optional(),
      quantity: z.number().int().min(1),
    }),
  ).min(1),
  shipping_address: z.object({
    name: z.string().min(1),
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postal_code: z.string().min(1),
    country: z.string().default("US"),
  }),
  payment_intent_id: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().email(),
});
