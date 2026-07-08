import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readLocalSubmissionExcel, saveSubmissionExcel } from "@/lib/excel";
import { hasBlobStorage } from "@/lib/env";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "ID candidatura mancante." },
      { status: 400 },
    );
  }

  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) {
    return NextResponse.json(
      { error: "Candidatura non trovata." },
      { status: 404 },
    );
  }

  if (hasBlobStorage() && submission.excelUrl) {
    return NextResponse.redirect(submission.excelUrl);
  }

  const fileName = submission.excelFileName;
  if (!fileName) {
    return NextResponse.json(
      { error: "File Excel non disponibile per questa candidatura." },
      { status: 404 },
    );
  }

  try {
    const file = await readLocalSubmissionExcel(submission.id, fileName);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch {
    const excel = await saveSubmissionExcel(submission);
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        excelUrl: excel.url,
        excelFileName: excel.fileName,
      },
    });

    const file = await readLocalSubmissionExcel(submission.id, excel.fileName);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${excel.fileName}"`,
      },
    });
  }
}
