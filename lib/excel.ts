import ExcelJS from "exceljs";
import { EXCEL_HEADERS, FIELD_KEYS } from "@/lib/fields";
import type { Submission } from "@/lib/types";

const LEGAL_FILL = "FFD9E4F5";
const OPERATIVO_FILL = "FFD9F0E3";
const DATA_ROW_HEIGHT = 18;
const HEADER_ROW_HEIGHT = 22;

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

function styleHeaderCell(cell: ExcelJS.Cell, index: number) {
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
  cell.font = { bold: true };
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: false };
}

function styleDataCell(cell: ExcelJS.Cell) {
  cell.alignment = { vertical: "middle", horizontal: "left", wrapText: false };
  cell.border = {
    top: { style: "thin", color: { argb: "FFDDDDDD" } },
    left: { style: "thin", color: { argb: "FFDDDDDD" } },
    bottom: { style: "thin", color: { argb: "FFDDDDDD" } },
    right: { style: "thin", color: { argb: "FFDDDDDD" } },
  };
}

export async function buildWorkbook(submission: Submission) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Candidatura", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  EXCEL_HEADERS.forEach((header, index) => {
    sheet.getColumn(index + 1).width = Math.max(header.length + 2, 18);
  });

  const headerRow = sheet.getRow(1);
  headerRow.height = HEADER_ROW_HEIGHT;
  EXCEL_HEADERS.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    styleHeaderCell(cell, index);
  });

  const dataRow = sheet.getRow(2);
  dataRow.height = DATA_ROW_HEIGHT;
  submissionToRow(submission).forEach((value, index) => {
    const cell = dataRow.getCell(index + 1);
    cell.value = value;
    styleDataCell(cell);
  });

  if (sheet.rowCount > 2) {
    sheet.spliceRows(3, sheet.rowCount - 2);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
