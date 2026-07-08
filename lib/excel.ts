import ExcelJS from "exceljs";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import type { Submission } from "@prisma/client";
import { EXCEL_HEADERS, FIELD_KEYS } from "@/lib/fields";
import { hasBlobStorage } from "@/lib/env";

const LEGAL_FILL = "FFBDD7EE";
const OPERATIVO_FILL = "FFF8CBAD";

export function submissionToRow(submission: Submission) {
  return FIELD_KEYS.map((key) => submission[key]);
}

export function buildExcelFileName(submission: Submission) {
  const slug =
    submission.ragioneSociale
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "cliente";

  return `candidatura-${slug}.xlsx`;
}

function localExcelPath(submissionId: string, fileName: string) {
  return path.join(process.cwd(), "data", "exports", submissionId, fileName);
}

export async function buildWorkbook(submission: Submission) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Candidatura");

  sheet.columns = EXCEL_HEADERS.map((header) => ({
    header,
    key: header,
    width: Math.max(header.length + 4, 18),
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", wrapText: true };

  EXCEL_HEADERS.forEach((_, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: index < 5 ? LEGAL_FILL : OPERATIVO_FILL },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF999999" } },
      left: { style: "thin", color: { argb: "FF999999" } },
      bottom: { style: "thin", color: { argb: "FF999999" } },
      right: { style: "thin", color: { argb: "FF999999" } },
    };
  });

  const row = sheet.addRow(submissionToRow(submission));
  row.alignment = { vertical: "top", wrapText: true };

  headerRow.height = 42;
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function saveSubmissionExcel(submission: Submission) {
  const fileName = buildExcelFileName(submission);
  const buffer = await buildWorkbook(submission);

  if (hasBlobStorage()) {
    const blob = await put(
      `submissions/${submission.id}/${fileName}`,
      buffer,
      {
        access: "public",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        addRandomSuffix: false,
      },
    );

    return { url: blob.url, fileName };
  }

  const filePath = localExcelPath(submission.id, fileName);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  return {
    url: `/api/admin/export/file?id=${submission.id}`,
    fileName,
  };
}


export async function readLocalSubmissionExcel(
  submissionId: string,
  fileName: string,
) {
  return readFile(localExcelPath(submissionId, fileName));
}
