import { z } from "zod";

export const submissionSchema = z.object({
  email: z.string().email("Inserisci un indirizzo email valido."),
  nomeCognome: z.string().min(2, "Inserisci nome e cognome."),
  ragioneSociale: z.string().min(2, "Inserisci la ragione sociale."),
  partitaIva: z
    .string()
    .regex(/^\d{11}$/, "La Partita IVA deve contenere 11 cifre."),
  sedeLegale: z.string().min(5, "Inserisci la sede legale."),
  indirizzoOperativo: z.string().min(3, "Inserisci l'indirizzo operativo."),
  comune: z.string().min(2, "Inserisci il comune."),
  cap: z.string().regex(/^\d{5}$/, "Il CAP deve contenere 5 cifre."),
  provincia: z
    .string()
    .regex(/^[A-Za-z]{2}$/, "La provincia deve essere di 2 lettere.")
    .transform((value) => value.toUpperCase()),
  regione: z.string().min(2, "Inserisci la regione."),
  tipologiaAttivita: z.string().min(2, "Inserisci la tipologia di attività."),
  esperienzaEnergetico: z
    .string()
    .min(5, "Descrivi la tua esperienza nel settore energetico."),
  altriCompetitor: z.string().min(2, "Indica gli altri competitor presenti."),
  website: z.string().max(0, "Richiesta non valida."),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
