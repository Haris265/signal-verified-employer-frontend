import type { ZipMemberFile } from "@/lib/library/api";

export type FileKind =
  | "pdf"
  | "docx"
  | "xlsx"
  | "ppt"
  | "txt"
  | "py"
  | "image"
  | "zip"
  | "other";

export function fileExt(file: ZipMemberFile | null | undefined): string {
  const fromName = (file?.name || file?.path || "").split(".").pop() || "";
  return fromName.toLowerCase().replace(/^\./, "");
}

export function getFileKind(
  file: ZipMemberFile | null | undefined,
  contentType = "",
): FileKind {
  const mime = (
    contentType ||
    file?.mime_type ||
    file?.content_type ||
    ""
  ).toLowerCase();
  const ext = fileExt(file);

  if (mime.includes("pdf") || ext === "pdf") return "pdf";
  if (
    mime.includes("wordprocessingml") ||
    mime.includes("msword") ||
    ext === "docx" ||
    ext === "doc"
  )
    return "docx";
  if (
    mime.includes("spreadsheetml") ||
    mime.includes("ms-excel") ||
    ext === "xlsx" ||
    ext === "xls" ||
    ext === "csv"
  )
    return "xlsx";
  if (
    mime.includes("presentationml") ||
    mime.includes("ms-powerpoint") ||
    ext === "pptx" ||
    ext === "ppt"
  )
    return "ppt";
  if (ext === "py" || mime.includes("x-python") || mime.includes("python"))
    return "py";
  if (
    mime.startsWith("text/") ||
    ["txt", "md", "log", "json", "csv"].includes(ext)
  ) {
    if (ext === "csv") return "xlsx";
    return "txt";
  }
  if (
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)
  )
    return "image";
  if (mime.includes("zip") || ext === "zip") return "zip";
  return "other";
}

/** Short badge for UI — never show raw MIME strings */
export function formatTypeLabel(
  file: ZipMemberFile | null | undefined,
  contentType = "",
): string {
  const ext = fileExt(file);
  if (ext && ext.length <= 5 && !ext.includes("/")) return ext.toUpperCase();

  const kind = getFileKind(file, contentType);
  const map: Record<FileKind, string> = {
    pdf: "PDF",
    docx: "DOCX",
    xlsx: "XLSX",
    ppt: "PPT",
    txt: "TXT",
    py: "PY",
    image: "IMG",
    zip: "ZIP",
    other: "FILE",
  };
  return map[kind];
}

export const FILE_KIND_THEME: Record<
  FileKind,
  { accent: string; soft: string; label: string }
> = {
  pdf: { accent: "#E11D48", soft: "#FFF1F2", label: "PDF" },
  docx: { accent: "#2563EB", soft: "#EFF6FF", label: "DOCX" },
  xlsx: { accent: "#059669", soft: "#ECFDF5", label: "XLSX" },
  ppt: { accent: "#EA580C", soft: "#FFF7ED", label: "PPT" },
  txt: { accent: "#64748B", soft: "#F8FAFC", label: "TXT" },
  py: { accent: "#CA8A04", soft: "#FEFCE8", label: "PY" },
  image: { accent: "#7A5CFF", soft: "#F3F0FF", label: "IMG" },
  zip: { accent: "#7A5CFF", soft: "#F3F0FF", label: "ZIP" },
  other: { accent: "#7A5CFF", soft: "#F3F0FF", label: "FILE" },
};
