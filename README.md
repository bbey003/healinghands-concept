# Healing Hands Spa

A production-grade Next.js 14 e-commerce + booking application for a wellness studio in Middletown, Delaware. Massage services, the *Essentially Yours* product line, and CEU classes for licensed practitioners.

Built as a complete reference implementation: end-to-end booking flow with slot holds, Stripe checkout (mock-safe), full auth with email verification, role-based admin panel, GDPR data export & deletion, granular cookie consent, and audit logging.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Start the dev server (works immediately with no env vars)
npm run dev

# 3. Open http://localhost:3000
```

The app runs out-of-the-box in **mock mode** — no Stripe, Supabase, or Resend keys required. An in-memory store is seeded with 6 users, 6 services, 6 products, and sample bookings on first request.

### Demo login
```
Email:    demo@healinghandsspa.com
Password: spa-demo-2026
```

All seeded staff (Adele, Marcus, Jasmine, Rosa, Liam) use the same demo password. Adele is the admin — sign in as `adele@healinghandsspa.com` to see `/admin`.

---

## Tech stack

- **Framework:** Next.js 14 (App Router) · TypeScript strict mode · React 18
- **Styling:** Tailwind CSS · custom organic palette (cream/sage/tan) · Cormorant Garamond + Fraunces + Inter
- **Database:** Supabase (PostgreSQL) — falls back to in-memory store when env vars are absent
- **Payments:** Stripe Checkout & Payment Intents — mock-succeeded when keys absent
- **Email:** Resend — logs to console when key absent
- **Auth:** Custom session cookies + bcryptjs password hashing
- **Validation:** Zod throughout
- **Animations:** Framer Motion + CSS animations
- **Icons:** Lucide React

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the keys you have. **Everything is optional** — missing keys gracefully degrade to mock behavior.

```env
# Session signing (defaults provided for dev)
SESSION_SECRET=

# Supabase — uses in-memory store when blank
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe — auto-succeeds mock payments when blank
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend — logs emails to console when blank
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@healinghandsspa.com

# App URL (used in verification + reset links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Project structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public pages)            # Home, About, Services, Shop, Cart, Checkout, etc.
│   ├── book/                     # Booking flow (calendar + slot holds)
│   ├── dashboard/                # Authenticated user area
│   ├── admin/                    # Role-protected admin panel
│   ├── api/                      # Route handlers (REST endpoints)
│   ├── login, register, …        # Auth pages
│   ├── privacy, terms, …         # Legal pages
│   ├── layout.tsx                # Root layout w/ providers + JSON-LD
│   └── globals.css               # Tailwind + design tokens
├── components/
│   ├── layout/                   # Navbar, Footer
│   ├── ui/                       # Button, Input, Modal, Toast, Loading
│   ├── auth/                     # LoginForm, RegisterForm, etc.
│   ├── booking/                  # BookingFlow (multi-step wizard)
│   ├── dashboard/                # DashboardShell, BookingsList, ProfileForm, etc.
│   ├── admin/                    # AdminShell + tables
│   ├── shop/                     # ProductCard, CartView, CheckoutFlow, etc.
│   ├── AuthProvider.tsx          # Client-side session context
│   ├── CartProvider.tsx          # localStorage-backed cart
│   └── CookieConsent.tsx         # GDPR-compliant granular consent
├── lib/
│   ├── auth/                     # Sessions, password hashing, rate limiting
│   ├── db/                       # Repos + in-memory store + seed
│   ├── email/                    # Resend wrapper w/ console fallback
│   ├── stripe/                   # Stripe wrapper w/ mock fallback
│   ├── validation/               # Zod schemas
│   ├── booking-availability.ts   # Slot generation
│   ├── api.ts                    # Response helpers
│   └── utils.ts                  # cn, formatPrice, formatDate, …
└── types/
    └── index.ts                  # All domain types
```

---

## Key features

### Booking system
- **4-step wizard:** service → date/time → review → confirmation
- **Calendar** with month navigation, disabled past/unavailable dates
- **Slot generation** respects provider availability rules + buffers + cancellation cutoff
- **10-minute holds** prevent double-booking during checkout (auto-expire with countdown timer)
- **Idempotency** on payment intent IDs

### Authentication
- Email + password (bcrypt) + session cookies
- Email verification flow with one-time tokens
- Password reset (no enumeration)
- Rate-limited login (5 attempts / 15 min) and registration (3 / hour per IP)

### Admin panel
- **Role-based:** `admin` and `moderator` roles only
- Stats dashboard, user management (suspend/activate), booking management (mark complete), verification review (approve/reject), audit log
- All admin actions append to the audit trail

### GDPR compliance
- **Granular cookie consent** (necessary always-on, analytics + marketing opt-in)
- **Data export** — JSON download from `/dashboard/profile`
- **Right to be forgotten** — anonymizes user record (preserves order/booking integrity for tax records)
- Privacy policy enumerates data processors and retention periods

### Shop
- Product variants (e.g. 15ml / 30ml essential oils), out-of-stock handling
- Cart in localStorage, persists across sessions
- 6% Delaware tax, free shipping over $75
- Order history in dashboard

### Notifications
- In-app notification system with unread counts
- Mark single / mark all read endpoints
- Created automatically on booking confirm, cancellation, verification decisions

---

## API routes

```
POST   /api/auth/register              Create account + send verification
POST   /api/auth/login                 Sign in
POST   /api/auth/logout                Sign out
GET    /api/auth/me                    Current user
GET    /api/auth/verify-email          Verify email (?token=)
POST   /api/auth/forgot-password       Request reset link
POST   /api/auth/reset-password        Set new password
PATCH  /api/auth/profile               Update display name + avatar

GET    /api/services                   Public service catalog
GET    /api/availability/:providerId   Slots (?date=&service_id=)
POST   /api/bookings/hold              Place 10-min slot hold
POST   /api/bookings                   Create booking after payment
GET    /api/bookings                   List own / provider's / all (by role)
GET    /api/bookings/:id               Booking details
PATCH  /api/bookings/:id/cancel        Cancel (with cutoff check)
PATCH  /api/bookings/:id/complete      Mark complete (provider/admin)

POST   /api/payments/intent            Create payment intent (booking | order)
GET    /api/payments/history           Combined transactions
POST   /api/webhooks/stripe            Webhook handler

GET    /api/products                   Product catalog
POST   /api/checkout                   Place product order
GET    /api/orders                     Order history

GET    /api/notifications              List notifications
GET    /api/notifications/count        Unread count
PATCH  /api/notifications/:id/read     Mark one read
POST   /api/notifications/read-all     Mark all read

POST   /api/contact                    Contact form
POST   /api/newsletter                 Newsletter subscribe

GET    /api/users/me/data              Export your data (GDPR)
DELETE /api/users/me/data              Delete your account (GDPR)

# Admin (role-gated)
PATCH  /api/admin/users/:id            Update user status/role
PATCH  /api/admin/verifications/:id    Approve / reject verification
```

---

## Design system

The visual language is "organic luxury" — slow, hand-crafted, never aggressive.

**Palette**
- Cream `#F5F0E8` — base
- Sage `#7D9B76` — primary accent
- Tan `#C4A882` — secondary accent
- Ink `#2A2520` — text

**Typography**
- Display: Cormorant Garamond + Fraunces (serif)
- Body: Inter (sans)
- Eyebrow labels: uppercase, wide letter-spacing

**Motifs**
- Asymmetric organic border-radius on hero images (`80px 24px 80px 24px`)
- Soft shadows (`shadow-soft`, `shadow-float`, `shadow-floathover`)
- Subtle scroll-triggered fade-up animations
- Generous whitespace, never tight

---

## Production deployment

1. **Provision Supabase project**, run migrations from `supabase/migrations/`
2. **Set environment variables** in your hosting platform (Vercel recommended)
3. **Configure Stripe webhook** to `POST /api/webhooks/stripe`
4. **Verify Resend domain** for production email delivery
5. **Run `npm run build`** — strict TypeScript checks all code

---

## License

Reference implementation. Use freely for learning and adaptation.
