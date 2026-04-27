import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { auditRepo, usersRepo } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Audit log" };

export default async function AuditPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/dashboard");

  const logs = auditRepo.listAll().slice(0, 100);

  return (
    <AdminShell>
      <h2 className="font-display text-2xl mb-6">Audit log</h2>
      {logs.length === 0 ? (
        <p className="text-ink-light">No audit events yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                {["Time", "User", "Action", "Target"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-sans text-xs uppercase tracking-wider text-ink-subtle">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {logs.map((log) => {
                const user = usersRepo.findById(log.user_id);
                return (
                  <tr key={log.id} className="hover:bg-cream-50">
                    <td className="px-4 py-3 text-ink-subtle">{formatDateTime(log.created_at)}</td>
                    <td className="px-4 py-3 text-ink">{user?.display_name ?? log.user_id}</td>
                    <td className="px-4 py-3 text-ink-light">{log.action}</td>
                    <td className="px-4 py-3 text-ink-subtle">
                      {log.target_type} {log.target_id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
