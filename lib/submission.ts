export function getSubmissionExcelDownloadUrl(submission: {
  id: string;
  excelUrl: string | null;
}) {
  return submission.excelUrl ?? `/api/admin/export/file?id=${submission.id}`;
}
