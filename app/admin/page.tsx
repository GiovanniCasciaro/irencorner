export const dynamic = "force-dynamic";

import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { listSubmissions } from "@/lib/store";

export default async function AdminPage() {
  const submissions = await listSubmissions();

  return (
    <main className="admin-shell">
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
        }))}
      />
    </main>
  );
}
