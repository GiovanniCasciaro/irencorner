"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { FORM_FIELDS } from "@/lib/fields";
import { SUBMIT_SUCCESS_MESSAGE } from "@/lib/submit-messages";

export function PartnerForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  useEffect(() => {
    if (searchParams.get("submitted") === "1") {
      setStatus({
        type: "success",
        message: SUBMIT_SUCCESS_MESSAGE,
      });
      router.replace("/#candidatura", { scroll: false });
      return;
    }

    const error = searchParams.get("error");
    if (error) {
      setStatus({
        type: "error",
        message: error,
      });
      router.replace("/#candidatura", { scroll: false });
    }
  }, [router, searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Invio in corso..." });

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          message: data.error ?? "Errore durante l'invio.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: data.message,
      });
      form.reset();
    } catch {
      setStatus({
        type: "error",
        message: "Errore di rete. Controlla la connessione e riprova.",
      });
    }
  }

  const legalFields = FORM_FIELDS.filter((field) => field.section === "legal");
  const operativoFields = FORM_FIELDS.filter(
    (field) => field.section === "operativo",
  );

  return (
    <form
      className="contact-form"
      action="/api/submit"
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="form-section form-section--legal">
        <h3>Dati legali e contatto</h3>
        <div className="input-row">
          {legalFields.slice(0, 2).map((field) => (
            <div className="input-group" key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              <input
                id={field.key}
                name={field.key}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}
        </div>
        {legalFields.slice(2).map((field) => (
          <div className="input-group" key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            <input
              id={field.key}
              name={field.key}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required
            />
          </div>
        ))}
      </div>

      <div className="form-section form-section--operativo">
        <h3>Sede operativa e profilo commerciale</h3>
        <div className="input-row">
          {operativoFields.slice(0, 5).map((field) => (
            <div className="input-group" key={field.key}>
              <label htmlFor={field.key}>{field.label}</label>
              <input
                id={field.key}
                name={field.key}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}
        </div>
        {operativoFields.slice(5).map((field) => (
          <div className="input-group" key={field.key}>
            <label htmlFor={field.key}>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                name={field.key}
                placeholder={field.placeholder}
                rows={4}
                required
              />
            ) : (
              <input
                id={field.key}
                name={field.key}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                required
              />
            )}
          </div>
        ))}
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Sito web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        className="btn btn-primary"
        type="submit"
        disabled={status.type === "loading"}
      >
        {status.type === "loading" ? "Invio in corso..." : "Invia candidatura"}
      </button>

      {status.message ? (
        <p
          className={`form-status ${status.type === "error" ? "error" : "success"}`}
          aria-live="polite"
        >
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
