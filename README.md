# Iren Corner

Landing page e form di candidatura partner IREN. I dati e un file Excel dedicato per ogni candidatura vengono salvati su Vercel Blob (in locale sul filesystem), con pannello admin protetto.

## Funzionalità

- Pagina informativa con offerte, provvigioni e istruzioni
- Form con 13 campi allineati all'Excel
- Generazione automatica di un file Excel dedicato per ogni candidatura
- Area admin protetta da password (`/admin`)
- Nessun database richiesto: tutto su Vercel Blob

## Requisiti

- Node.js 20+
- Account Vercel con Blob abilitato (per la produzione)

## Setup locale

1. Copia le variabili ambiente:

```bash
cp .env.example .env.local
```

2. Compila `.env.local` con `ADMIN_PASSWORD` e `SESSION_SECRET`. In locale il token Blob è opzionale: se assente, i dati vengono salvati nella cartella `./data`.

3. Installa le dipendenze e avvia il server:

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). L'area admin è su [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy su Vercel

1. Collega il repository a Vercel e importa il progetto.
2. Dal dashboard Vercel crea **Storage → Blob**: la variabile `BLOB_READ_WRITE_TOKEN` viene aggiunta automaticamente al progetto.
3. Aggiungi le variabili ambiente:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET` (stringa casuale ≥ 32 caratteri)
4. Deploy. Il build esegue solo `next build`, senza dipendenze da database.
5. (Opzionale) Configura un dominio custom nel progetto Vercel.

## Struttura Excel

Ogni candidatura genera un file Excel personale (`candidatura-<ragione-sociale>.xlsx`) con un foglio `Candidatura`:

- Colonne A–E (blu): dati legali e contatto
- Colonne F–M (arancione): sede operativa e profilo commerciale

Header colorati e in grassetto, con una riga contenente i dati del cliente. Scaricabile dall'admin per ogni cliente.

## Note operative

- Storage: `submissions/{id}/data.json` (dati) e `submissions/{id}/candidatura-*.xlsx` (Excel).
- Il form include honeypot e rate limit base (5 invii/ora per IP).
