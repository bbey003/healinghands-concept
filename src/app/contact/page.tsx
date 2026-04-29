"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage(): JSX.Element {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string): void => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = (await res.json()) as { ok: boolean; error?: string };
    setLoading(false);
    if (!j.ok) {
      toast.push("error", j.error ?? "Could not send message.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="container-content py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Get in touch</p>
          <h1 className="display-h1 mt-4">We&apos;d love to hear from you.</h1>
          <p className="mt-4 max-w-sm text-lg text-ink-light">
            Questions about a treatment, a gift for someone you love, or just not sure
            where to start — reach out and we&apos;ll get back to you within one business day.
          </p>
          <div className="mt-8 space-y-2 text-ink-light">
            <p>327 Main Street · Middletown, DE 19709</p>
            <p>(302) 555-0139</p>
            <p>Tuesday – Saturday · 9 am – 6 pm</p>
          </div>
        </div>

        <div className="float-card p-8">
          {sent ? (
            <div className="py-8 text-center">
              <p className="font-display text-2xl text-sage-700">Thank you.</p>
              <p className="mt-2 text-ink-light">We&apos;ll be in touch within one business day.</p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
              <Textarea
                label="Message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={5}
                required
              />
              <Button type="submit" loading={loading} fullWidth>
                Send message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
