export type UserRole = "admin" | "moderator" | "provider" | "user";
export type UserStatus = "active" | "suspended" | "pending";
export type BookingStatus = "confirmed" | "completed" | "cancelled" | "held";
export type RefundStatus = "none" | "pending" | "refunded";
export type NotificationType =
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_completed"
  | "order_placed"
  | "system_alert"
  | "verification_approved"
  | "verification_rejected";

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  role: UserRole;
  status: UserStatus;
  email_verified_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PublicUser = Pick<User, "id" | "email" | "display_name" | "avatar_url" | "role">;

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  duration_minutes: number;
  price_cents: number;
  buffer_after_minutes: number;
  max_advance_days: number;
  cancellation_cutoff_hours: number;
  is_active: boolean;
  category: string;
  image_url: string;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price_cents: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price_cents: number;
  compare_at_cents: number | null;
  category: string;
  image_url: string;
  gallery: string[];
  stock: number;
  variants: ProductVariant[];
  is_active: boolean;
  created_at: string;
}

export interface AvailabilityRule {
  id: string;
  provider_id: string;
  day_of_week: number; // 0=Sun … 6=Sat
  start_time: string; // "HH:mm"
  end_time: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  start_at: string;
  end_at: string;
  status: BookingStatus;
  notes: string;
  price_cents: number;
  stripe_payment_intent_id: string;
  cancellation_reason: string | null;
  refund_status: RefundStatus;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  quantity: number;
  price_cents: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  total_cents: number;
  stripe_payment_intent_id: string;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  action_url: string | null;
  image_url: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  is_dismissed: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}

export interface SlotHold {
  slot_key: string; // `${providerId}_${startAt}`
  user_id: string;
  service_id: string;
  start_at: string;
  expires_at: string;
}

export interface Session {
  user_id: string;
  role: UserRole;
}

export interface Credential {
  user_id: string;
  password_hash: string;
}

export interface VerificationToken {
  token: string;
  type: "email_verification" | "password_reset";
  user_id: string;
  expires_at: string;
}

export interface CartItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  variant_name: string | null;
  price_cents: number;
  quantity: number;
  image_url: string;
}
