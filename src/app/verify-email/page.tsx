import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { tokensRepo, usersRepo } from "@/lib/db";

async function VerifyContent({ token }: { token: string }): Promise<JSX.Element> {
  const userId = tokensRepo.consume(token, "email_verification");
  if (!userId) {
    return (
      <div className="text-center">
        <p className="font-display text-xl text-red-600">Link invalid or expired.</p>
        <Link href="/login" className="btn-primary mt-6">
          Back to sign in
        </Link>
      </div>
    );
  }
  usersRepo.update(userId, { email_verified_at: new Date().toISOString() });
  return (
    <div className="text-center">
      <p className="font-display text-xl text-sage-700">Email verified!</p>
      <p className="mt-2 text-ink-light">Your account is ready.</p>
      <Link href="/dashboard" className="btn-primary mt-6">
        Go to dashboard
      </Link>
    </div>
  );
}

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props): Promise<JSX.Element> {
  const { token } = await searchParams;
  if (!token) redirect("/login");

  return (
    <div className="container-content flex min-h-[80vh] items-center justify-center py-12">
      <Suspense fallback={<p>Verifying…</p>}>
        <VerifyContent token={token} />
      </Suspense>
    </div>
  );
}
