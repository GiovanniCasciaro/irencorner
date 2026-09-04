export const dynamic = "force-dynamic";
export const revalidate = 0;

import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { listSubmissions } from "@/lib/store";

type AdminTab = "unread" | "read" | "trash";

function parseTab(value: string | undefined): AdminTab {
  if (value === "read" || value === "trash" || value === "unread") {
    return value;
  }
  return "unread";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const submissions = await listSubmissions();

  return (
    <main className="admin-shell">
      <SubmissionTable
        initialSection={parseTab(params.tab)}
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
