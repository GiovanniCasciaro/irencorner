export const dynamic = "force-dynamic";

import { SubmissionTable } from "@/components/admin/SubmissionTable";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      email: true,
      ragioneSociale: true,
      partitaIva: true,
      provincia: true,
      comune: true,
      excelUrl: true,
    },
  });

  return (
    <main className="admin-shell">
      <SubmissionTable
        submissions={submissions.map((submission) => ({
          ...submission,
          createdAt: submission.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
