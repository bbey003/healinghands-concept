"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export function RegisterForm(): JSX.Element {
  const router = useRouter();
  const { refresh } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, display_name: name }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) {
        setError(j.error ?? "Registration failed.");
        return;
      }
      await refresh();
      toast.push("success", "Account created! Welcome to Healing Hands.");
      router.push("/dashboard");
    } catch {
      toast.push("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <Input
        label="Full name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
        hint="At least 8 characters"
      />
      <Button type="submit" loading={loading} fullWidth>
        Create account
      </Button>
      <p className="text-center text-sm text-ink-light">
        Already have an account?{" "}
        <Link href="/login" className="text-sage-700 hover:text-sage-800">
          Sign in
        </Link>
      </p>
    </form>
  );
}
