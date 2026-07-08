import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSubmission, getSubmissionExcel } from "@/lib/store";
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

  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json(
      { error: "Candidatura non trovata." },
      { status: 404 },
    );
  }

  if (hasBlobStorage() && submission.excelUrl) {
    return NextResponse.redirect(submission.excelUrl);
  }

  const { buffer, fileName } = await getSubmissionExcel(submission);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
