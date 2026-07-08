"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSubmissionExcelDownloadUrl } from "@/lib/submission";

type SubmissionRow = {
  id: string;
  createdAt: string;
  email: string;
  ragioneSociale: string;
  partitaIva: string;
  provincia: string;
  comune: string;
  excelUrl: string | null;
};

export function SubmissionTable({
  submissions,
}: {
  submissions: SubmissionRow[];
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <div>
          <h1>Candidature partner</h1>
          <p className="hero-subtitle">
            {submissions.length} richieste ricevute
          </p>
        </div>
        <button
          className="btn btn-ghost btn-small"
          type="button"
          onClick={handleLogout}
        >
          Esci
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Ragione sociale</th>
              <th>Email</th>
              <th>P.IVA</th>
              <th>Comune</th>
              <th>Prov.</th>
              <th></th>
              <th>Excel</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={8}>Nessuna candidatura ancora ricevuta.</td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <tr key={submission.id}>
                  <td>
                    {new Date(submission.createdAt).toLocaleString("it-IT")}
                  </td>
                  <td>{submission.ragioneSociale}</td>
                  <td>{submission.email}</td>
                  <td>{submission.partitaIva}</td>
                  <td>{submission.comune}</td>
                  <td>{submission.provincia}</td>
                  <td>
                    <Link
                      className="btn btn-ghost btn-small"
                      href={`/admin/${submission.id}`}
                    >
                      Dettaglio
                    </Link>
                  </td>
                  <td>
                    <a
                      className="btn btn-primary btn-small"
                      href={getSubmissionExcelDownloadUrl(submission)}
                    >
                      Scarica
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
