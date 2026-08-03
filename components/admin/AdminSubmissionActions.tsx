"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminSubmissionActions({
  id,
  inTrash,
}: {
  id: string;
  inTrash: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: "trash" | "restore" | "purge", message?: string) {
    if (message && !window.confirm(message)) {
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Operazione non riuscita.");
      }

      if (action === "purge") {
        router.push("/admin");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operazione non riuscita.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-actions">
      {inTrash ? (
        <>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            disabled={busy}
            onClick={() => run("restore")}
          >
            Ripristina
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small admin-btn-danger"
            disabled={busy}
            onClick={() =>
              run(
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
          disabled={busy}
          onClick={() =>
            run("trash", "Spostare questa candidatura nel cestino?")
          }
        >
          Sposta nel cestino
        </button>
      )}
      {error ? <p className="form-status error">{error}</p> : null}
    </div>
  );
}
