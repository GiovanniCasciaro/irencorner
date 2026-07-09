import ExcelJS from "exceljs";
import JSZip from "jszip";
import { EXCEL_HEADERS, FIELD_KEYS } from "@/lib/fields";
import type { Submission } from "@/lib/types";

const LEGAL_FILL = "FFD9E4F5";
const OPERATIVO_FILL = "FFD9F0E3";

function toSingleLine(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s*\r?\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
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

function trimWorksheetToTwoRows(sheet: ExcelJS.Worksheet) {
  const maxRow = sheet.actualRowCount;
  if (maxRow > 2) {
    sheet.spliceRows(3, maxRow - 2);
  }

  for (let rowNumber = 1; rowNumber <= 2; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    row.height = rowNumber === 1 ? 22 : 18;
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = {
        ...cell.alignment,
        wrapText: false,
        shrinkToFit: false,
      };
    });
  }

  sheet.pageSetup.printArea = "A1:M2";
}

export async function buildWorkbook(submission: Submission) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Candidatura", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { defaultRowHeight: 18 },
  });

  EXCEL_HEADERS.forEach((header, index) => {
    sheet.getColumn(index + 1).width = Math.max(header.length + 2, 18);
  });

  const headerValues = submissionToRow(submission);
  const headerRow = sheet.addRow([...EXCEL_HEADERS]);
  const dataRow = sheet.addRow([...headerValues]);

  EXCEL_HEADERS.forEach((_, index) => {
    styleHeaderCell(headerRow.getCell(index + 1), index);
    styleDataCell(dataRow.getCell(index + 1));
  });

  trimWorksheetToTwoRows(sheet);

  const rawBuffer = Buffer.from(await workbook.xlsx.writeBuffer());
  return enforceTwoRowXlsx(rawBuffer);
}

async function enforceTwoRowXlsx(buffer: Buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const sheetPath = "xl/worksheets/sheet1.xml";
  const sheetFile = zip.file(sheetPath);
  if (!sheetFile) {
    return buffer;
  }

  let xml = await sheetFile.async("string");
  xml = xml.replace(/<dimension ref="[^"]+"/, '<dimension ref="A1:M2"');
  xml = xml.replace(
    /<row\b[^>]*\br="(\d+)"[^>]*>[\s\S]*?<\/row>/g,
    (match, rowNumber) => (Number(rowNumber) <= 2 ? match : ""),
  );
  zip.file(sheetPath, xml);
  return Buffer.from(
    await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }),
  );
}
