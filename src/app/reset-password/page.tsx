"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

function ResetForm(): JSX.Element {
  const search = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const token = search.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = (await res.json()) as { ok: boolean; error?: string };
    setLoading(false);
    if (!j.ok) {
      toast.push("error", j.error ?? "Reset failed. The link may have expired.");
      return;
    }
    toast.push("success", "Password updated! Please sign in.");
    router.push("/login");
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
      <Input
        label="New password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        hint="At least 8 characters"
      />
      <Button type="submit" loading={loading} fullWidth>
        Set new password
      </Button>
    </form>
  );
}

export default function ResetPasswordPage(): JSX.Element {
  return (
    <div className="container-content flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="display-h2 mb-8">Choose a new password</h1>
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
