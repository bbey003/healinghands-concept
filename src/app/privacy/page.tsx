import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage(): JSX.Element {
  return (
    <div className="container-content max-w-3xl py-16">
      <h1 className="display-h2">Privacy Policy</h1>
      <p className="mt-2 text-ink-subtle">Last updated: January 1, 2026</p>

      <div className="prose mt-10 text-ink-light space-y-6">
        <section>
          <h2 className="font-display text-xl text-ink">Data we collect</h2>
          <p>Name, email address, and password (hashed with bcrypt). Booking and order history. Optional: avatar URL, session preferences.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">How we use your data</h2>
          <p>To operate your account, process bookings, fulfill orders, and send transactional emails (booking confirmations, password resets). We do not sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Data processors</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Supabase (database hosting, US region)</li>
            <li>Stripe (payment processing — card data never touches our servers)</li>
            <li>Resend (transactional email)</li>
            <li>Vercel (hosting)</li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Cookies</h2>
          <p>We set one authentication cookie (necessary, HttpOnly, Secure, SameSite=Lax). Analytics and marketing cookies require your consent via the banner.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Retention</h2>
          <p>Account data is retained until you request deletion. Booking and order records are anonymized (not deleted) on account deletion to preserve financial records for tax purposes.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Your rights</h2>
          <p>You may export or delete your account data at any time from <a href="/dashboard/profile" className="text-sage-700 underline">Dashboard → Profile</a>.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Contact</h2>
          <p>Questions? Email <a href="mailto:hello@healinghandsspa.com" className="text-sage-700 underline">hello@healinghandsspa.com</a> or use the <a href="/contact" className="text-sage-700 underline">contact form</a>.</p>
        </section>
      </div>
    </div>
  );
}
