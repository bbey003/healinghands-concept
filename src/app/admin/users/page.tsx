import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth/sessions";
import { usersRepo } from "@/lib/db";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage(): Promise<JSX.Element> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin" && session.role !== "moderator") redirect("/dashboard");

  const users = usersRepo.list().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <AdminShell>
      <h2 className="font-display text-2xl mb-6">Users ({users.length})</h2>
      <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="border-b border-cream-200 bg-cream-50">
            <tr>
              {["Name", "Email", "Role", "Status", "Created"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-xs uppercase tracking-wider text-ink-subtle">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-cream-50">
                <td className="px-4 py-3 font-medium text-ink">{u.display_name}</td>
                <td className="px-4 py-3 text-ink-light">{u.email}</td>
                <td className="px-4 py-3 capitalize text-ink-light">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.status === "active" ? "bg-sage-100 text-sage-700" : "bg-red-50 text-red-600"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-subtle">{formatDateTime(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
