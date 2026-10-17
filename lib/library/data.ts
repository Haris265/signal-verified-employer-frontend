export const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

/** Static demo data — replace with API later */
export const STATIC_STUDENTS = [
  {
    id: "s1",
    student_name: "John",
    project_brief:
      "SMB deal execution analysis submission with Trace File and assumptions sheet.",
    brief_pdf_url: SAMPLE_PDF_URL,
  },
  {
    id: "s2",
    student_name: "Emma",
    project_brief:
      "Revenue accuracy pack covering error patterns and leadership summary notes.",
    brief_pdf_url: SAMPLE_PDF_URL,
  },
  {
    id: "s3",
    student_name: "Michael",
    project_brief:
      "Collaboration and peer-signal materials ready for reviewer package download.",
    brief_pdf_url: SAMPLE_PDF_URL,
  },
  {
    id: "s4",
    student_name: "Sophia",
    project_brief:
      "Storytelling evidence and empowerment case files included in the Library zip.",
    brief_pdf_url: SAMPLE_PDF_URL,
  },
  {
    id: "s5",
    student_name: "David",
    project_brief:
      "Tech stack submission bundle with performance notes and supporting artifacts.",
    brief_pdf_url: SAMPLE_PDF_URL,
  },
] as const;

export type LibraryStudent = (typeof STATIC_STUDENTS)[number];

/** Static demo data — replace with API later */
export const STATIC_PROJECT_ZIPS = [
  {
    id: "1",
    project_name: "SMB Deal Execution Analysis",
    file_name: "smb-deal-execution.zip",
    size: "24.6 MB",
    updated_at: "2026-10-10T14:22:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
  {
    id: "2",
    project_name: "Revenue Accuracy Trace File",
    file_name: "revenue-accuracy-trace.zip",
    size: "18.2 MB",
    updated_at: "2026-10-11T09:05:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
  {
    id: "3",
    project_name: "Collaboration Peer Signals",
    file_name: "collaboration-peer-signals.zip",
    size: "9.4 MB",
    updated_at: "2026-10-12T16:40:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
  {
    id: "4",
    project_name: "Storytelling Evidence Pack",
    file_name: "storytelling-evidence.zip",
    size: "31.1 MB",
    updated_at: "2026-10-13T11:18:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
  {
    id: "5",
    project_name: "Tech Stack Submission Bundle",
    file_name: "tech-stack-bundle.zip",
    size: "42.8 MB",
    updated_at: "2026-10-14T08:55:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
  {
    id: "6",
    project_name: "Empowerment Case Materials",
    file_name: "empowerment-materials.zip",
    size: "12.0 MB",
    updated_at: "2026-10-14T19:30:00Z",
    zip_url: SAMPLE_PDF_URL,
  },
] as const;

export type ProjectZip = (typeof STATIC_PROJECT_ZIPS)[number];

export function getStudentById(id: string) {
  return STATIC_STUDENTS.find((s) => s.id === id) ?? null;
}
