import type { FieldKey } from "@/lib/fields";

export type SubmissionData = Record<FieldKey, string>;

export type Submission = SubmissionData & {
  id: string;
  createdAt: string;
  excelUrl: string | null;
  excelFileName: string | null;
};
