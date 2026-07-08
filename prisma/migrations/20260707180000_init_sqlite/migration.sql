-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "nomeCognome" TEXT NOT NULL,
    "ragioneSociale" TEXT NOT NULL,
    "partitaIva" TEXT NOT NULL,
    "sedeLegale" TEXT NOT NULL,
    "indirizzoOperativo" TEXT NOT NULL,
    "comune" TEXT NOT NULL,
    "cap" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "regione" TEXT NOT NULL,
    "tipologiaAttivita" TEXT NOT NULL,
    "esperienzaEnergetico" TEXT NOT NULL,
    "altriCompetitor" TEXT NOT NULL
);
