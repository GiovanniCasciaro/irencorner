# Iren Corner

Landing page e form di candidatura partner IREN con salvataggio dati su Postgres, export Excel su Vercel Blob e pannello admin.

## Funzionalità

- Pagina informativa con offerte, provvigioni e istruzioni
- Form con 13 campi (allineati all'Excel) + upload documento identità e visura camerale
- Generazione automatica di un file Excel dedicato per ogni candidatura
- Area admin protetta da password (`/admin`)

## Requisiti

- Node.js 20+
- Account Vercel con Postgres e Blob abilitati

## Setup locale

1. Copia le variabili ambiente:

```bash
cp .env.example .env.local
```

2. Compila `.env.local` con i valori reali di database, blob e credenziali admin.

3. Installa dipendenze e applica le migration:

```bash
npm install
npx prisma migrate deploy
```

4. Avvia il server di sviluppo:

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). L'area admin è su [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy su Vercel

1. Collega il repository a Vercel e importa il progetto.
2. Dal dashboard Vercel, crea:
   - **Storage → Postgres** e collega `DATABASE_URL`
   - **Storage → Blob** e collega `BLOB_READ_WRITE_TOKEN`
3. Aggiungi le variabili ambiente:
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET` (stringa casuale ≥ 32 caratteri)
4. Il comando di build esegue automaticamente `prisma generate`, `prisma migrate deploy` e `next build`.
5. Configura il dominio custom del progetto (es. `irencorner.tuodominio.it`):
   - Aggiungi un record CNAME verso `cname.vercel-dns.com`
   - Associa il dominio nel progetto Vercel

## Struttura Excel

Il file generato contiene un foglio `Candidature` con header colorati:

- Colonne A–E (blu): dati legali e contatto
- Colonne F–M (arancione): sede operativa e profilo commerciale

Ogni candidatura genera un Excel personale con una sola riga dati, scaricabile dall'admin per cliente.
- Il form include honeypot e rate limit base (5 invii/ora per IP).
