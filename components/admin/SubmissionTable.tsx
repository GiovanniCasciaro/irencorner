"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSubmissionExcelDownloadUrl } from "@/lib/submission";

type AdminSection = "unread" | "read" | "trash";

export type SubmissionRow = {
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

type ActionResult = {
  submission?: SubmissionRow & Record<string, unknown>;
  ok?: boolean;
  error?: string;
};

async function runAction(
  id: string,
  action: "trash" | "restore" | "purge",
): Promise<ActionResult> {
  const response = await fetch(`/api/admin/submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  const data = (await response.json().catch(() => null)) as ActionResult | null;
  if (!response.ok) {
    throw new Error(data?.error ?? "Operazione non riuscita.");
  }
  return data ?? {};
}

function isUnread(row: SubmissionRow) {
  return !row.deletedAt && !row.readAt;
}

function isRead(row: SubmissionRow) {
  return !row.deletedAt && Boolean(row.readAt);
}

function isTrash(row: SubmissionRow) {
  return Boolean(row.deletedAt);
}

function toRow(submission: SubmissionRow & Record<string, unknown>): SubmissionRow {
  return {
    id: String(submission.id),
    createdAt: String(submission.createdAt),
    email: String(submission.email),
    ragioneSociale: String(submission.ragioneSociale),
    partitaIva: String(submission.partitaIva),
    provincia: String(submission.provincia),
    comune: String(submission.comune),
    excelUrl:
      typeof submission.excelUrl === "string" ? submission.excelUrl : null,
    readAt: typeof submission.readAt === "string" ? submission.readAt : null,
    deletedAt:
      typeof submission.deletedAt === "string" ? submission.deletedAt : null,
  };
}

export function SubmissionTable({
  submissions,
  initialSection = "unread",
}: {
  submissions: SubmissionRow[];
  initialSection?: AdminSection;
}) {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>(initialSection);
  const [rows, setRows] = useState<SubmissionRow[]>(submissions);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    setRows(submissions);
  }, [submissions]);

  const counts = useMemo(
    () => ({
      unread: rows.filter(isUnread).length,
      read: rows.filter(isRead).length,
      trash: rows.filter(isTrash).length,
    }),
    [rows],
  );

  const visible = useMemo(() => {
    if (section === "unread") return rows.filter(isUnread);
    if (section === "read") return rows.filter(isRead);
    return rows.filter(isTrash);
  }, [section, rows]);

  function goToSection(next: AdminSection) {
    setSection(next);
    router.replace(`/admin?tab=${next}`, { scroll: false });
  }

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
      const result = await runAction(id, action);

      if (action === "purge") {
        setRows((current) => current.filter((row) => row.id !== id));
        goToSection("trash");
      } else if (result.submission) {
        const updated = toRow(result.submission);
        setRows((current) =>
          current.map((row) => (row.id === id ? updated : row)),
        );

        if (action === "trash") {
          goToSection("trash");
        } else if (action === "restore") {
          goToSection(updated.readAt ? "read" : "unread");
        }
      }

      // Refresh after local state update so server props catch up to mailbox.
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
          onClick={() => goToSection("unread")}
        >
          Da leggere
          <span className="admin-tab__count">{counts.unread}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === "read"}
          className={`admin-tab ${section === "read" ? "is-active" : ""}`}
          onClick={() => goToSection("read")}
        >
          Lette
          <span className="admin-tab__count">{counts.read}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={section === "trash"}
          className={`admin-tab ${section === "trash" ? "is-active" : ""}`}
          onClick={() => goToSection("trash")}
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
                    isUnread(submission) ? "admin-row--unread" : undefined
                  }
                >
                  <td>
                    {new Date(submission.createdAt).toLocaleString("it-IT")}
                  </td>
                  <td>
                    {isUnread(submission) ? (
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
                      prefetch={false}
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
