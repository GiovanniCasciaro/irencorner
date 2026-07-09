import { mkdir, writeFile, readFile, readdir } from "fs/promises";
import path from "path";
import { assertStorageAvailable, hasBlobStorage } from "@/lib/env";
import {
  listSubmissionDataBlobs,
  readBlobText,
  submissionDataPath,
  submissionExcelPath,
  writeBlob,
} from "@/lib/blob-access";
import { buildExcelFileName, buildWorkbook } from "@/lib/excel";
import type { Submission, SubmissionData } from "@/lib/types";

const DATA_ROOT = path.join(process.cwd(), "data", "submissions");
const XLSX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function localDir(id: string) {
  return path.join(DATA_ROOT, id);
}

function localDataPath(id: string) {
  return path.join(localDir(id), "data.json");
}

function localExcelPath(id: string, fileName: string) {
  return path.join(localDir(id), fileName);
}

function adminExcelUrl(id: string) {
  return `/api/admin/export/file?id=${id}`;
}

async function saveToBlob(submission: Submission, excelBuffer: Buffer) {
  const { id, excelFileName } = submission;
  if (!excelFileName) {
    throw new Error("Nome file Excel mancante.");
  }

  await writeBlob(
    submissionExcelPath(id, excelFileName),
    excelBuffer,
    XLSX_CONTENT_TYPE,
  );

  submission.excelUrl = adminExcelUrl(id);

  await writeBlob(
    submissionDataPath(id),
    JSON.stringify(submission),
    "application/json; charset=utf-8",
  );
}

async function saveLocally(
  submission: Submission,
  excelBuffer: Buffer,
  fileName: string,
) {
  submission.excelUrl = adminExcelUrl(submission.id);
  await mkdir(localDir(submission.id), { recursive: true });
  await writeFile(localExcelPath(submission.id, fileName), excelBuffer);
  await writeFile(
    localDataPath(submission.id),
    JSON.stringify(submission, null, 2),
  );
}

export async function createSubmission(
  input: SubmissionData,
): Promise<Submission> {
  assertStorageAvailable();

  const id = crypto.randomUUID();
  const submission: Submission = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    excelUrl: null,
    excelFileName: null,
  };

  const fileName = buildExcelFileName(submission);
  submission.excelFileName = fileName;

  const excelBuffer = await buildWorkbook(submission);

  try {
    if (hasBlobStorage()) {
      await saveToBlob(submission, excelBuffer);
    } else {
      await saveLocally(submission, excelBuffer, fileName);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Errore storage sconosciuto";
    console.error("Storage error:", error);
    throw new Error(
      hasBlobStorage()
        ? `Impossibile salvare la candidatura su Vercel Blob: ${message}`
        : `Impossibile salvare la candidatura in locale: ${message}`,
    );
  }

  return submission;
}

export async function listSubmissions(): Promise<Submission[]> {
  let submissions: Submission[] = [];

  if (hasBlobStorage()) {
    const dataBlobs = await listSubmissionDataBlobs();
    const results = await Promise.all(
      dataBlobs.map(async (blob) => {
        try {
          const raw = await readBlobText(blob.pathname);
          return JSON.parse(raw) as Submission;
        } catch {
          return null;
        }
      }),
    );
    submissions = results.filter((item): item is Submission => item !== null);
  } else {
    try {
      const dirs = await readdir(DATA_ROOT, { withFileTypes: true });
      const results = await Promise.all(
        dirs
          .filter((entry) => entry.isDirectory())
          .map(async (entry) => {
            try {
              const raw = await readFile(localDataPath(entry.name), "utf-8");
              return JSON.parse(raw) as Submission;
            } catch {
              return null;
            }
          }),
      );
      submissions = results.filter(
        (item): item is Submission => item !== null,
      );
    } catch {
      submissions = [];
    }
  }

  return submissions.sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export async function getSubmission(id: string): Promise<Submission | null> {
  if (hasBlobStorage()) {
    try {
      const raw = await readBlobText(submissionDataPath(id));
      return JSON.parse(raw) as Submission;
    } catch {
      return null;
    }
  }

  try {
    const raw = await readFile(localDataPath(id), "utf-8");
    return JSON.parse(raw) as Submission;
  } catch {
    return null;
  }
}

export async function getSubmissionExcel(
  submission: Submission,
): Promise<{ buffer: Buffer; fileName: string }> {
  const fileName = submission.excelFileName ?? buildExcelFileName(submission);
  const buffer = await buildWorkbook(submission);
  return { buffer, fileName };
}
