import ExcelJS from "exceljs";
import { EXCEL_HEADERS, FIELD_KEYS } from "@/lib/fields";
import type { Submission } from "@/lib/types";

const LEGAL_FILL = "FFD9E4F5";
const OPERATIVO_FILL = "FFD9F0E3";

function toSingleLine(value: string) {
  return value.replace(/\s*\r?\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function submissionToRow(submission: Submission) {
  return FIELD_KEYS.map((key) => toSingleLine(submission[key] ?? ""));
}

export function buildExcelFileName(submission: Pick<Submission, "ragioneSociale">) {
  const slug =
    submission.ragioneSociale
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "cliente";

  return `candidatura-${slug}.xlsx`;
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
  row.alignment = { vertical: "middle", wrapText: false };

  headerRow.height = 32;
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
