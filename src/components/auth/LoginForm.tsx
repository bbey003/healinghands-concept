"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export function LoginForm(): JSX.Element {
  const router = useRouter();
  const search = useSearchParams();
  const { refresh } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) {
        setErrors({ form: j.error ?? "Invalid email or password." });
        return;
      }
      await refresh();
      const redirect = search.get("redirect") ?? "/dashboard";
      router.push(redirect);
    } catch {
      toast.push("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      {errors.form && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.form}
        </p>
      )}
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
        autoComplete="current-password"
        required
      />
      <div className="flex items-center justify-between">
        <Link href="/forgot-password" className="text-xs text-sage-700 hover:text-sage-800">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" loading={loading} fullWidth>
        Sign in
      </Button>
      <p className="text-center text-sm text-ink-light">
        No account?{" "}
        <Link href="/register" className="text-sage-700 hover:text-sage-800">
          Create one
        </Link>
      </p>
    </form>
  );
}
