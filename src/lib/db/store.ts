import type {
  User,
  Service,
  Product,
  AvailabilityRule,
  Booking,
  Order,
  Notification,
  AuditLog,
  SlotHold,
  Credential,
  VerificationToken,
} from "@/types";

interface Store {
  users: User[];
  credentials: Credential[];
  services: Service[];
  products: Product[];
  availability_rules: AvailabilityRule[];
  bookings: Booking[];
  orders: Order[];
  notifications: Notification[];
  audit_logs: AuditLog[];
  holds: SlotHold[];
  tokens: VerificationToken[];
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __healingHandsStore: Store | undefined;
}

function createStore(): Store {
  return {
    users: [],
    credentials: [],
    services: [],
    products: [],
    availability_rules: [],
    bookings: [],
    orders: [],
    notifications: [],
    audit_logs: [],
    holds: [],
    tokens: [],
    seeded: false,
  };
}

export const store: Store =
  globalThis.__healingHandsStore ?? (globalThis.__healingHandsStore = createStore());

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function nowIso(): string {
  return new Date().toISOString();
}
