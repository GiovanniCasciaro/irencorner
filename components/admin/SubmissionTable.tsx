"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSubmissionExcelDownloadUrl } from "@/lib/submission";

type AdminSection = "unread" | "read" | "trash";

type SubmissionRow = {
  id: string;
  createdAt: string;
  email: string;
  ragioneSociale: string;
  partitaIva: string;
  provincia: string;
  comune: string;
  excelUrl: string | null;
  readAt: string | null;
  deletedAt: string | null;
};

async function runAction(id: string, action: "trash" | "restore" | "purge") {
  const response = await fetch(`/api/admin/submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Operazione non riuscita.");
  }
}

export function SubmissionTable({
  submissions,
}: {
  submissions: SubmissionRow[];
}) {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>("unread");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const unread = submissions.filter((s) => !s.deletedAt && !s.readAt).length;
    const read = submissions.filter((s) => !s.deletedAt && s.readAt).length;
    const trash = submissions.filter((s) => Boolean(s.deletedAt)).length;
    return { unread, read, trash };
  }, [submissions]);

  const visible = useMemo(() => {
    if (section === "unread") {
      return submissions.filter((s) => !s.deletedAt && !s.readAt);
    }
    if (section === "read") {
      return submissions.filter((s) => !s.deletedAt && s.readAt);
    }
    return submissions.filter((s) => Boolean(s.deletedAt));
  }, [section, submissions]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleAction(
    id: string,
    action: "trash" | "restore" | "purge",
    confirmMessage?: string,
  ) {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    setBusyId(id);
    setError("");
    try {
      await runAction(id, action);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operazione non riuscita.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="admin-card">
      <div className="admin-header">
        <div>
          <h1>Candidature partner</h1>
          <p className="hero-subtitle">
            {counts.unread} da leggere · {counts.read} lette · {counts.trash} nel
            cestino
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

      <div className="admin-tabs" role="tablist" aria-label="Sezioni candidature">
        <button
          type="button"
          role="tab"
          aria-selected={section === "unread"}
          className={`admin-tab ${section === "unread" ? "is-active" : ""}`}
          onClick={() => setSection("unread")}
        >
          Da leggere
          <span className="admin-tab__count">{counts.unread}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === "read"}
          className={`admin-tab ${section === "read" ? "is-active" : ""}`}
          onClick={() => setSection("read")}
        >
          Lette
          <span className="admin-tab__count">{counts.read}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === "trash"}
          className={`admin-tab ${section === "trash" ? "is-active" : ""}`}
          onClick={() => setSection("trash")}
        >
          Cestino
          <span className="admin-tab__count">{counts.trash}</span>
        </button>
      </div>

      {error ? <p className="form-status error">{error}</p> : null}

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
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  {section === "unread"
                    ? "Nessuna candidatura da leggere."
                    : section === "read"
                      ? "Nessuna candidatura letta."
                      : "Il cestino è vuoto."}
                </td>
              </tr>
            ) : (
              visible.map((submission) => (
                <tr
                  key={submission.id}
                  className={
                    !submission.readAt && !submission.deletedAt
                      ? "admin-row--unread"
                      : undefined
                  }
                >
                  <td>
                    {new Date(submission.createdAt).toLocaleString("it-IT")}
                  </td>
                  <td>
                    {!submission.readAt && !submission.deletedAt ? (
                      <strong>{submission.ragioneSociale}</strong>
                    ) : (
                      submission.ragioneSociale
                    )}
                  </td>
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
                  <td>
                    <div className="admin-actions">
                      {section === "trash" ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-ghost btn-small"
                            disabled={busyId === submission.id}
                            onClick={() =>
                              handleAction(submission.id, "restore")
                            }
                          >
                            Ripristina
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-small admin-btn-danger"
                            disabled={busyId === submission.id}
                            onClick={() =>
                              handleAction(
                                submission.id,
                                "purge",
                                "Eliminare definitivamente questa candidatura? L'operazione non è reversibile.",
                              )
                            }
                          >
                            Elimina definitivo
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost btn-small admin-btn-danger"
                          disabled={busyId === submission.id}
                          onClick={() =>
                            handleAction(
                              submission.id,
                              "trash",
                              "Spostare questa candidatura nel cestino?",
                            )
                          }
                        >
                          Elimina
                        </button>
                      )}
                    </div>
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
