import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage(): JSX.Element {
  return (
    <div className="container-content max-w-3xl py-16">
      <h1 className="display-h2">Terms of Service</h1>
      <p className="mt-2 text-ink-subtle">Last updated: January 1, 2026</p>

      <div className="mt-10 space-y-6 text-ink-light">
        <section>
          <h2 className="font-display text-xl text-ink">Bookings</h2>
          <p>Appointments may be cancelled up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours are non-refundable. CEU courses require 72 hours notice.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Shop & orders</h2>
          <p>All product sales are final unless the item arrives damaged. Contact us within 7 days of delivery for damaged goods.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Payments</h2>
          <p>All payments are processed securely by Stripe. Healing Hands Spa never stores card numbers.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Health disclaimer</h2>
          <p>Massage therapy is not a substitute for medical care. Please inform your therapist of any medical conditions, injuries, or medications before your session.</p>
        </section>
        <section>
          <h2 className="font-display text-xl text-ink">Governing law</h2>
          <p>These terms are governed by the laws of the State of Delaware, USA.</p>
        </section>
      </div>
    </div>
  );
}
