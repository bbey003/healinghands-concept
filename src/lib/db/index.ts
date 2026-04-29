import { store, generateId, nowIso } from "./store";
import { seedAll } from "./seed";
import type {
  User,
  PublicUser,
  Service,
  Product,
  Booking,
  Order,
  OrderItem,
  Notification,
  AuditLog,
  SlotHold,
  ShippingAddress,
} from "@/types";

function ensureSeeded(): void {
  if (!store.seeded) seedAll();
}

function toPublic(u: User): PublicUser {
  return { id: u.id, email: u.email, display_name: u.display_name, avatar_url: u.avatar_url, role: u.role };
}

export const usersRepo = {
  findById(id: string): User | null {
    ensureSeeded();
    return store.users.find((u) => u.id === id) ?? null;
  },
  findByEmail(email: string): User | null {
    ensureSeeded();
    return store.users.find((u) => u.email === email.toLowerCase()) ?? null;
  },
  findPublicById(id: string): PublicUser | null {
    const u = usersRepo.findById(id);
    return u ? toPublic(u) : null;
  },
  list(): User[] {
    ensureSeeded();
    return [...store.users];
  },
  create(data: Omit<User, "created_at" | "updated_at"> & { password_hash: string }): User {
    ensureSeeded();
    const { password_hash, ...rest } = data;
    const user: User = {
      ...rest,
      email: rest.email.toLowerCase(),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    store.users.push(user);
    store.credentials.push({ user_id: user.id, password_hash });
    return user;
  },
  update(id: string, patch: Partial<User>): User | null {
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    store.users[idx] = { ...store.users[idx]!, ...patch, updated_at: nowIso() };
    return store.users[idx]!;
  },
  getPasswordHash(user_id: string): string | null {
    ensureSeeded();
    return store.credentials.find((c) => c.user_id === user_id)?.password_hash ?? null;
  },
  updatePasswordHash(user_id: string, hash: string): void {
    const idx = store.credentials.findIndex((c) => c.user_id === user_id);
    if (idx !== -1) store.credentials[idx]!.password_hash = hash;
  },
};

export const servicesRepo = {
  listActive(): Service[] {
    ensureSeeded();
    return store.services.filter((s) => s.is_active);
  },
  listAll(): Service[] {
    ensureSeeded();
    return [...store.services];
  },
  findById(id: string): Service | null {
    ensureSeeded();
    return store.services.find((s) => s.id === id) ?? null;
  },
  findBySlug(slug: string): Service | null {
    ensureSeeded();
    return store.services.find((s) => s.slug === slug) ?? null;
  },
};

export const productsRepo = {
  listActive(): Product[] {
    ensureSeeded();
    return store.products.filter((p) => p.is_active);
  },
  listAll(): Product[] {
    ensureSeeded();
    return [...store.products];
  },
  findById(id: string): Product | null {
    ensureSeeded();
    return store.products.find((p) => p.id === id) ?? null;
  },
  findBySlug(slug: string): Product | null {
    ensureSeeded();
    return store.products.find((p) => p.slug === slug) ?? null;
  },
  decrementStock(id: string, variantId: string | null, qty: number): boolean {
    ensureSeeded();
    const p = store.products.find((x) => x.id === id);
    if (!p) return false;
    if (variantId) {
      const v = p.variants.find((x) => x.id === variantId);
      if (!v || v.stock < qty) return false;
      v.stock -= qty;
    } else {
      if (p.stock < qty) return false;
      p.stock -= qty;
    }
    return true;
  },
};

export const bookingsRepo = {
  findById(id: string): Booking | null {
    ensureSeeded();
    return store.bookings.find((b) => b.id === id) ?? null;
  },
  listByUser(user_id: string): Booking[] {
    ensureSeeded();
    return store.bookings.filter((b) => b.user_id === user_id);
  },
  listByProvider(provider_id: string): Booking[] {
    ensureSeeded();
    return store.bookings.filter((b) => b.provider_id === provider_id);
  },
  listAll(): Booking[] {
    ensureSeeded();
    return [...store.bookings];
  },
  create(data: Omit<Booking, "id" | "created_at" | "updated_at">): Booking {
    ensureSeeded();
    const booking: Booking = {
      ...data,
      id: generateId(),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    store.bookings.push(booking);
    return booking;
  },
  update(id: string, patch: Partial<Booking>): Booking | null {
    const idx = store.bookings.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    store.bookings[idx] = { ...store.bookings[idx]!, ...patch, updated_at: nowIso() };
    return store.bookings[idx]!;
  },
  isSlotTaken(provider_id: string, start_at: string, end_at: string, excludeId?: string): boolean {
    ensureSeeded();
    const start = new Date(start_at).getTime();
    const end = new Date(end_at).getTime();
    return store.bookings.some((b) => {
      if (b.id === excludeId) return false;
      if (b.provider_id !== provider_id) return false;
      if (b.status === "cancelled") return false;
      const bs = new Date(b.start_at).getTime();
      const be = new Date(b.end_at).getTime();
      return start < be && end > bs;
    });
  },
};

export const holdsRepo = {
  get(slot_key: string): SlotHold | null {
    const h = store.holds.find((h) => h.slot_key === slot_key);
    if (!h) return null;
    if (new Date(h.expires_at) < new Date()) {
      store.holds = store.holds.filter((x) => x.slot_key !== slot_key);
      return null;
    }
    return h;
  },
  create(data: Omit<SlotHold, "expires_at">): SlotHold {
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const hold: SlotHold = { ...data, expires_at };
    store.holds = store.holds.filter((h) => h.slot_key !== data.slot_key);
    store.holds.push(hold);
    return hold;
  },
  release(slot_key: string): void {
    store.holds = store.holds.filter((h) => h.slot_key !== slot_key);
  },
  isHeld(provider_id: string, start_at: string, excluding_user?: string): boolean {
    const key = `${provider_id}_${start_at}`;
    const h = store.holds.find((x) => x.slot_key === key);
    if (!h) return false;
    if (new Date(h.expires_at) < new Date()) return false;
    if (excluding_user && h.user_id === excluding_user) return false;
    return true;
  },
};

export const ordersRepo = {
  findById(id: string): Order | null {
    ensureSeeded();
    return store.orders.find((o) => o.id === id) ?? null;
  },
  listByUser(user_id: string): Order[] {
    ensureSeeded();
    return store.orders.filter((o) => o.user_id === user_id);
  },
  listAll(): Order[] {
    ensureSeeded();
    return [...store.orders];
  },
  create(data: {
    user_id: string;
    items: OrderItem[];
    subtotal_cents: number;
    tax_cents: number;
    shipping_cents: number;
    stripe_payment_intent_id: string;
    shipping_address: ShippingAddress | null;
  }): Order {
    ensureSeeded();
    const order: Order = {
      id: generateId(),
      ...data,
      status: "paid",
      total_cents: data.subtotal_cents + data.tax_cents + data.shipping_cents,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    store.orders.push(order);
    return order;
  },
};

export const notificationsRepo = {
  listForUser(user_id: string): Notification[] {
    ensureSeeded();
    return store.notifications.filter((n) => n.user_id === user_id && !n.is_dismissed);
  },
  countUnread(user_id: string): number {
    ensureSeeded();
    return store.notifications.filter((n) => n.user_id === user_id && !n.is_read && !n.is_dismissed).length;
  },
  create(data: Omit<Notification, "id" | "created_at">): Notification {
    const n: Notification = { ...data, id: generateId(), created_at: nowIso() };
    store.notifications.push(n);
    return n;
  },
  markRead(id: string): void {
    const n = store.notifications.find((x) => x.id === id);
    if (n) { n.is_read = true; n.read_at = nowIso(); }
  },
  markAllRead(user_id: string): void {
    store.notifications
      .filter((n) => n.user_id === user_id && !n.is_read)
      .forEach((n) => { n.is_read = true; n.read_at = nowIso(); });
  },
};

export const auditRepo = {
  log(data: Omit<AuditLog, "id" | "created_at">): void {
    store.audit_logs.push({ ...data, id: generateId(), created_at: nowIso() });
  },
  listAll(): AuditLog[] {
    ensureSeeded();
    return [...store.audit_logs].reverse();
  },
};

export const tokensRepo = {
  create(user_id: string, type: "email_verification" | "password_reset"): string {
    const token = generateId() + generateId();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    store.tokens = store.tokens.filter(
      (t) => !(t.user_id === user_id && t.type === type),
    );
    store.tokens.push({ token, type, user_id, expires_at });
    return token;
  },
  consume(token: string, type: "email_verification" | "password_reset"): string | null {
    const idx = store.tokens.findIndex((t) => t.token === token && t.type === type);
    if (idx === -1) return null;
    const t = store.tokens[idx]!;
    if (new Date(t.expires_at) < new Date()) {
      store.tokens.splice(idx, 1);
      return null;
    }
    store.tokens.splice(idx, 1);
    return t.user_id;
  },
};
