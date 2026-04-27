import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage(): JSX.Element {
  return (
    <div className="container-content flex min-h-[80vh] items-center justify-center py-12">
      <div className="w-full max-w-md">
        <h1 className="display-h2 mb-2">Create your account</h1>
        <p className="mb-8 text-ink-light">Join Healing Hands to book appointments and shop.</p>
        <RegisterForm />
      </div>
    </div>
  );
}
