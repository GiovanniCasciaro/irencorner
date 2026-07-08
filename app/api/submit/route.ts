import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validation";
import { createSubmission } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 60;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra un'ora." },
        { status: 429 },
      );
    }

    const formData = await request.formData();
    const payload = {
      email: String(formData.get("email") ?? ""),
      nomeCognome: String(formData.get("nomeCognome") ?? ""),
      ragioneSociale: String(formData.get("ragioneSociale") ?? ""),
      partitaIva: String(formData.get("partitaIva") ?? "").replace(/\s/g, ""),
      sedeLegale: String(formData.get("sedeLegale") ?? ""),
      indirizzoOperativo: String(formData.get("indirizzoOperativo") ?? ""),
      comune: String(formData.get("comune") ?? ""),
      cap: String(formData.get("cap") ?? ""),
      provincia: String(formData.get("provincia") ?? ""),
      regione: String(formData.get("regione") ?? ""),
      tipologiaAttivita: String(formData.get("tipologiaAttivita") ?? ""),
      esperienzaEnergetico: String(formData.get("esperienzaEnergetico") ?? ""),
      altriCompetitor: String(formData.get("altriCompetitor") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    const parsed = submissionSchema.safeParse(payload);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Dati non validi.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { website: _website, ...data } = parsed.data;

    await createSubmission(data);

    return NextResponse.json({
      success: true,
      message:
        "Richiesta inviata con successo. Dopo l'approvazione di IREN riceverai il contratto via email per la firma digitale.",
    });
  } catch (error) {
    console.error("Submit error:", error);

    if (error instanceof Error) {
      if (
        error.message.includes("BLOB_READ_WRITE_TOKEN") ||
        error.message.includes("Storage non configurato")
      ) {
        return NextResponse.json(
          {
            error:
              "Servizio temporaneamente non disponibile. Contatta l'amministratore del sito.",
          },
          { status: 503 },
        );
      }

      if (
        error.message.includes("Vercel Blob") ||
        error.message.includes("Impossibile salvare la candidatura su Vercel Blob")
      ) {
        return NextResponse.json(
          {
            error:
              "Impossibile salvare la candidatura. Riprova tra qualche minuto.",
          },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      { error: "Errore durante l'invio. Riprova più tardi." },
      { status: 500 },
    );
  }
}
