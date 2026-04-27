"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/Toast";

export function ProfileForm(): JSX.Element {
  const { user, refresh } = useAuth();
  const toast = useToast();
  const [name, setName] = useState(user?.display_name ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: name }),
      });
      const j = (await res.json()) as { ok: boolean; error?: string };
      if (!j.ok) {
        toast.push("error", j.error ?? "Update failed.");
        return;
      }
      await refresh();
      toast.push("success", "Profile updated.");
    } catch {
      toast.push("error", "Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (): Promise<void> => {
    const res = await fetch("/api/users/me/data");
    const j = await res.json() as Record<string, unknown>;
    const blob = new Blob([JSON.stringify(j, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-healing-hands-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.push("success", "Your data has been downloaded.");
  };

  return (
    <div className="space-y-8">
      <form onSubmit={(e) => void handleSubmit(e)} className="float-card p-6 md:p-8 space-y-5">
        <h2 className="font-display text-xl">Profile</h2>
        <Input
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input label="Email" value={user?.email ?? ""} disabled hint="Email cannot be changed." />
        <Button type="submit" loading={loading}>
          Save changes
        </Button>
      </form>

      <div className="float-card p-6 md:p-8">
        <h2 className="font-display text-xl">Your data</h2>
        <p className="mt-2 text-sm text-ink-light">
          Download a copy of all data associated with your account.
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => void handleExport()}>
          Download my data
        </Button>
      </div>
    </div>
  );
}
