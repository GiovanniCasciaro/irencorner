export const dynamic = "force-dynamic";
export const revalidate = 0;

import { AdminListRefresh } from "@/components/admin/AdminListRefresh";
import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { listSubmissions } from "@/lib/store";

export default async function AdminPage() {
  const submissions = await listSubmissions();

  return (
    <main className="admin-shell">
      <AdminListRefresh />
      <SubmissionTable
        submissions={submissions.map((submission) => ({
          id: submission.id,
          createdAt: submission.createdAt,
          email: submission.email,
          ragioneSociale: submission.ragioneSociale,
          partitaIva: submission.partitaIva,
          provincia: submission.provincia,
          comune: submission.comune,
          excelUrl: submission.excelUrl,
          readAt: submission.readAt ?? null,
          deletedAt: submission.deletedAt ?? null,
        }))}
      />
    </main>
  );
}
