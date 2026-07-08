import { list, put } from "@vercel/blob";
import { mkdir, writeFile, readFile, readdir } from "fs/promises";
import path from "path";
import { hasBlobStorage } from "@/lib/env";
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

async function fetchJson(url: string): Promise<Submission | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Submission;
  } catch {
    return null;
  }
}

export async function createSubmission(
  input: SubmissionData,
): Promise<Submission> {
  const id = crypto.randomUUID();
  const submission: Submission = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    excelUrl: null,
    excelFileName: null,
  };

  const fileName = buildExcelFileName(submission);
  const excelBuffer = await buildWorkbook(submission);
  submission.excelFileName = fileName;

  if (hasBlobStorage()) {
    const excelBlob = await put(
      `submissions/${id}/${fileName}`,
      excelBuffer,
      {
        access: "public",
        contentType: XLSX_CONTENT_TYPE,
        addRandomSuffix: false,
        allowOverwrite: true,
      },
    );
    submission.excelUrl = excelBlob.url;

    await put(`submissions/${id}/data.json`, JSON.stringify(submission), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return submission;
  }

  submission.excelUrl = `/api/admin/export/file?id=${id}`;
  await mkdir(localDir(id), { recursive: true });
  await writeFile(localExcelPath(id, fileName), excelBuffer);
  await writeFile(localDataPath(id), JSON.stringify(submission, null, 2));

  return submission;
}

export async function listSubmissions(): Promise<Submission[]> {
  let submissions: Submission[] = [];

  if (hasBlobStorage()) {
    const { blobs } = await list({ prefix: "submissions/" });
    const dataBlobs = blobs.filter((blob) =>
      blob.pathname.endsWith("/data.json"),
    );
    const results = await Promise.all(
      dataBlobs.map((blob) => fetchJson(blob.url)),
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
              const raw = await readFile(
                localDataPath(entry.name),
                "utf-8",
              );
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
    const { blobs } = await list({ prefix: `submissions/${id}/` });
    const dataBlob = blobs.find((blob) =>
      blob.pathname.endsWith("/data.json"),
    );
    if (!dataBlob) return null;
    return fetchJson(dataBlob.url);
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

  try {
    const buffer = await readFile(localExcelPath(submission.id, fileName));
    return { buffer, fileName };
  } catch {
    const buffer = await buildWorkbook(submission);
    await mkdir(localDir(submission.id), { recursive: true });
    await writeFile(localExcelPath(submission.id, fileName), buffer);
    return { buffer, fileName };
  }
}
