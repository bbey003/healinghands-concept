"use client";

import type { Metadata } from "next";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage(): JSX.Element {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="container-content flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="display-h2 mb-2">Reset your password</h1>
        {sent ? (
          <p className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 p-6 text-sm text-sage-700">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Check
            your inbox (and spam folder).
          </p>
        ) : (
          <>
            <p className="mb-8 text-ink-light">
              Enter your email and we&apos;ll send a reset link.
            </p>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} fullWidth>
                Send reset link
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
