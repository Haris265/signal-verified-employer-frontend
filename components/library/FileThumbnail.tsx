"use client";

import { File, FileSpreadsheet, FileText, Presentation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { openZipMember, type ZipMemberFile } from "@/lib/library/api";

type ThumbKind = "pdf" | "xlsx" | "pptx" | "docx" | "image" | "other";

type CachedThumb =
  | { kind: "pdf" | "image"; dataUrl: string }
  | { kind: "xlsx"; rows: string[][] }
  | { kind: "pptx" | "docx" | "other"; title: string };

const thumbCache = new Map<string, CachedThumb>();

function extOf(file: ZipMemberFile) {
  const fromName = (file.name || file.path || "").split(".").pop() || "";
  return fromName.toLowerCase().replace(/^\./, "");
}

export function fileThumbKind(file: ZipMemberFile): ThumbKind {
  const mime = (file.mime_type || file.content_type || "").toLowerCase();
  const ext = extOf(file);
  if (mime.includes("pdf") || ext === "pdf") return "pdf";
  if (
    mime.includes("spreadsheetml") ||
    mime.includes("ms-excel") ||
    ["xlsx", "xls", "csv"].includes(ext)
  )
    return "xlsx";
  if (
    mime.includes("presentationml") ||
    mime.includes("ms-powerpoint") ||
    ["pptx", "ppt"].includes(ext)
  )
    return "pptx";
  if (
    mime.includes("wordprocessingml") ||
    mime.includes("msword") ||
    ["docx", "doc"].includes(ext)
  )
    return "docx";
  if (
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)
  )
    return "image";
  return "other";
}

function coverThumb(file: ZipMemberFile, kind: ThumbKind): CachedThumb {
  const title = file.name || file.path || "File";
  if (kind === "xlsx") return { kind: "xlsx", rows: [] };
  if (kind === "pptx") return { kind: "pptx", title };
  if (kind === "docx") return { kind: "docx", title };
  return { kind: "other", title };
}

async function renderPdfThumbnail(blob: Blob): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await blob.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 0.55 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.72);
}

async function renderXlsxRows(blob: Blob): Promise<string[][]> {
  const buffer = await blob.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const first = workbook.SheetNames[0];
  if (!first) return [];
  const sheet = workbook.Sheets[first];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as unknown[][];
  return rows.slice(0, 6).map((row) =>
    (Array.isArray(row) ? row : []).slice(0, 4).map((cell) =>
      cell == null || cell === "" ? "" : String(cell).slice(0, 24),
    ),
  );
}

async function buildThumbnail(file: ZipMemberFile): Promise<CachedThumb> {
  const key = file.preview_url;
  const kind = fileThumbKind(file);

  if (key && thumbCache.has(key)) return thumbCache.get(key)!;

  // PPT/DOC: branded visual covers (true slide raster needs server-side render)
  if (!key || kind === "pptx" || kind === "docx" || kind === "other") {
    const entry = coverThumb(file, kind);
    if (key) thumbCache.set(key, entry);
    return entry;
  }

  const { blob, objectUrl } = await openZipMember(key);
  try {
    let entry: CachedThumb;
    if (kind === "pdf") {
      entry = { kind: "pdf", dataUrl: await renderPdfThumbnail(blob) };
      URL.revokeObjectURL(objectUrl);
    } else if (kind === "image") {
      entry = { kind: "image", dataUrl: objectUrl };
    } else if (kind === "xlsx") {
      entry = { kind: "xlsx", rows: await renderXlsxRows(blob) };
      URL.revokeObjectURL(objectUrl);
    } else {
      URL.revokeObjectURL(objectUrl);
      entry = coverThumb(file, kind);
    }
    thumbCache.set(key, entry);
    return entry;
  } catch {
    URL.revokeObjectURL(objectUrl);
    const fallback = coverThumb(file, kind);
    thumbCache.set(key, fallback);
    return fallback;
  }
}

function TypeCover({
  kind,
  title,
}: {
  kind: "pptx" | "docx" | "other" | "xlsx" | "pdf";
  title: string;
}) {
  const label =
    kind === "pptx"
      ? "PPT"
      : kind === "docx"
        ? "DOC"
        : kind === "xlsx"
          ? "XLS"
          : kind === "pdf"
            ? "PDF"
            : "FILE";
  const Icon =
    kind === "pptx"
      ? Presentation
      : kind === "xlsx"
        ? FileSpreadsheet
        : kind === "docx" || kind === "pdf"
          ? FileText
          : File;
  const tone =
    kind === "pptx"
      ? "from-[#fff4e8] to-[#ffe0c2] text-[#c2410c]"
      : kind === "xlsx"
        ? "from-[#e8f8ef] to-[#cfeedd] text-[#15803d]"
        : kind === "docx"
          ? "from-[#e8eefc] to-[#d4e0fb] text-[#1d4ed8]"
          : kind === "pdf"
            ? "from-[#fde8e8] to-[#f8d0d0] text-[#b91c1c]"
            : "from-[#f3f0ff] to-[#ebe6ff] text-primary";

  return (
    <div className={`flex h-full w-full flex-col justify-between bg-gradient-to-br p-3 ${tone}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide shadow-sm">
          {label}
        </span>
        <Icon size={18} className="opacity-80" />
      </div>
      <p className="line-clamp-3 text-left text-xs font-semibold leading-snug text-[#0B0B0F]/90">
        {title.replace(/\.[^.]+$/, "") || title}
      </p>
      {kind === "pptx" && (
        <div className="mt-1 space-y-1.5 opacity-35">
          <div className="h-1.5 w-[85%] rounded bg-current" />
          <div className="h-1.5 w-[60%] rounded bg-current" />
          <div className="h-1.5 w-[70%] rounded bg-current" />
        </div>
      )}
    </div>
  );
}

function XlsxMiniGrid({ rows }: { rows: string[][] }) {
  if (!rows.length) return <TypeCover kind="xlsx" title="Spreadsheet" />;
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-emerald-100 bg-[#e8f8ef] px-2 py-1">
        <span className="text-[10px] font-bold tracking-wide text-[#15803d]">XLSX</span>
        <FileSpreadsheet size={12} className="text-[#15803d]" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-1">
        <table className="w-full border-collapse text-[9px] leading-tight">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri === 0 ? "bg-[#f0fdf4]" : ""}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`max-w-[4.5rem] truncate border border-emerald-100/80 px-1 py-0.5 ${
                      ri === 0 ? "font-semibold text-[#14532d]" : "text-gray-600"
                    }`}
                  >
                    {cell || "\u00A0"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FileThumbnail({
  file,
  className = "",
}: {
  file: ZipMemberFile;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumb, setThumb] = useState<CachedThumb | null>(() =>
    file.preview_url ? thumbCache.get(file.preview_url) ?? null : null,
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (!file.preview_url) {
      setThumb(coverThumb(file, fileThumbKind(file)));
      return;
    }

    if (thumbCache.has(file.preview_url)) {
      setThumb(thumbCache.get(file.preview_url)!);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const result = await buildThumbnail(file);
        if (!cancelled) setThumb(result);
      } catch {
        if (!cancelled) setThumb(coverThumb(file, fileThumbKind(file)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [visible, file]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden bg-gradient-to-br from-[#f3f0ff] to-[#ebe6ff] ${className}`}
    >
      {loading && !thumb && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#f3f0ff] via-white to-[#ebe6ff]" />
      )}

      {thumb?.kind === "pdf" && thumb.dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb.dataUrl} alt="" className="h-full w-full object-cover object-top" />
      ) : thumb?.kind === "image" && thumb.dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb.dataUrl} alt="" className="h-full w-full object-cover" />
      ) : thumb?.kind === "xlsx" ? (
        <XlsxMiniGrid rows={thumb.rows} />
      ) : thumb?.kind === "pptx" || thumb?.kind === "docx" || thumb?.kind === "other" ? (
        <TypeCover kind={thumb.kind} title={thumb.title} />
      ) : !loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-white shadow-sm">
            <File className="text-primary" size={28} />
          </div>
        </div>
      ) : null}

      {thumb?.kind === "pdf" && thumb.dataUrl ? (
        <span className="absolute left-2 top-2 rounded bg-[#b91c1c] px-1.5 py-0.5 text-[9px] font-bold text-white shadow">
          PDF
        </span>
      ) : null}
    </div>
  );
}
