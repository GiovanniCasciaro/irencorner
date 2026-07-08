export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { FORM_FIELDS } from "@/lib/fields";
import { getSubmissionExcelDownloadUrl } from "@/lib/submission";
import { prisma } from "@/lib/db";

export default async function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({ where: { id } });

  if (!submission) {
    notFound();
  }

  const legalFields = FORM_FIELDS.filter((field) => field.section === "legal");
  const operativoFields = FORM_FIELDS.filter(
    (field) => field.section === "operativo",
  );

  return (
    <main className="admin-shell">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <Link href="/admin" className="btn btn-ghost btn-small">
              ← Torna alla lista
            </Link>
            <h1 style={{ marginTop: "1rem" }}>{submission.ragioneSociale}</h1>
            <p className="hero-subtitle">
              Ricevuta il{" "}
              {submission.createdAt.toLocaleString("it-IT", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
            <a
              className="btn btn-primary btn-small"
              href={getSubmissionExcelDownloadUrl(submission)}
              style={{ marginTop: "1rem" }}
            >
              Scarica Excel cliente
            </a>
          </div>
        </div>

        <div className="form-section form-section--legal" style={{ marginTop: "1.5rem" }}>
          <h3>Dati legali e contatto</h3>
          <div className="detail-grid">
            {legalFields.map((field) => (
              <div className="detail-item" key={field.key}>
                <span>{field.label}</span>
                <strong>{submission[field.key]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section form-section--operativo">
          <h3>Sede operativa e profilo commerciale</h3>
          <div className="detail-grid">
            {operativoFields.map((field) => (
              <div className="detail-item" key={field.key}>
                <span>{field.label}</span>
                <strong>{submission[field.key]}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>File Excel</h3>
          <p className="hero-subtitle" style={{ marginBottom: "1rem" }}>
            Excel personalizzato con i dati di questa candidatura.
          </p>
          <a
            className="btn btn-primary btn-small"
            href={getSubmissionExcelDownloadUrl(submission)}
          >
            Scarica Excel cliente
          </a>
        </div>
      </div>
    </main>
  );
}
