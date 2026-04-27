import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage(): JSX.Element {
  return (
    <div className="container-content flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="display-h2 mb-2">Welcome back</h1>
        <p className="mb-8 text-ink-light">Sign in to your Healing Hands account.</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
