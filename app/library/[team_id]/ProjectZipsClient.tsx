"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  getTeamZipContents,
  libraryErrorMessage,
  openZipMember,
  type ZipMemberFile,
} from "@/lib/library/api";
import { fileExt, formatTypeLabel } from "@/lib/library/fileType";
import { renderAsync as renderDocx } from "docx-preview";
import {
  ArrowLeft,
  Download,
  Eye,
  File,
  FileArchive,
  FileText,
  FolderOpen,
  Grid3X3,
  HardDrive,
  List,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { FileTypeThumb } from "../FileTypeThumb";

const formatBytes = (bytes: number | undefined) => {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

type PreviewKind = "pdf" | "docx" | "xlsx" | "image" | "text" | null;

const isInlinePreviewable = (
  file: ZipMemberFile | null | undefined,
  contentType = "",
): PreviewKind => {
  const mime = (contentType || file?.mime_type || file?.content_type || "").toLowerCase();
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
    mime.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)
  )
    return "image";
  if (mime.startsWith("text/") || ["txt", "md", "json", "log"].includes(ext))
    return "text";
  return null;
};

function TextBlobPreview({ blob }: { blob: Blob }) {
  const [text, setText] = useState("");
  useEffect(() => {
    let cancelled = false;
    blob.text().then((t) => {
      if (!cancelled) setText(t);
    });
    return () => {
      cancelled = true;
    };
  }, [blob]);
  return (
    <pre className="h-full overflow-auto whitespace-pre-wrap break-words bg-white p-6 text-sm text-[#0B0B0F]">
      {text || "…"}
    </pre>
  );
}

function DocxBlobPreview({ blob }: { blob: Blob }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!containerRef.current || !blob) return;
      try {
        setLoading(true);
        setError("");
        containerRef.current.innerHTML = "";
        await renderDocx(blob, containerRef.current, undefined, {
          className: "docx-preview-body",
          inWrapper: true,
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render DOCX");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [blob]);

  return (
    <div className="relative h-full overflow-auto bg-gray-100">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 text-gray-500">
          <Loader2 className="animate-spin text-primary" size={28} />
          <p className="text-sm">Rendering document…</p>
        </div>
      )}
      {error ? (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <p className="font-semibold text-red-600">{error}</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="docx-preview-root mx-auto min-h-full max-w-4xl bg-white p-4 shadow-sm sm:p-8 [&_.docx-wrapper]:bg-transparent"
        />
      )}
    </div>
  );
}

function XlsxBlobPreview({ blob }: { blob: Blob }) {
  const [sheets, setSheets] = useState<Array<{ name: string; rows: unknown[][] }>>([]);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError("");
        const buffer = await blob.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const parsed = workbook.SheetNames.map((name) => {
          const sheet = workbook.Sheets[name];
          const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: false,
          }) as unknown[][];
          return { name, rows };
        });
        if (cancelled) return;
        setSheets(parsed);
        setActive(0);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render spreadsheet");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [blob]);

  const current = sheets[active];

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-500">
        <Loader2 className="animate-spin text-primary" size={28} />
        <p className="text-sm">Rendering spreadsheet…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <p className="font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {sheets.length > 1 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-gray-200 bg-gray-50 px-3 py-2">
          {sheets.map((s, i) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${i === active
                  ? "bg-primary text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-auto p-3">
        {!current?.rows?.length ? (
          <p className="p-6 text-center text-sm text-gray-500">Empty sheet</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <tbody>
              {current.rows.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? "bg-[#f3f0ff]" : "odd:bg-gray-50"}>
                  {(Array.isArray(row) ? row : []).map((cell, ci) => (
                    <td
                      key={ci}
                      className={`whitespace-nowrap border border-gray-200 px-3 py-1.5 text-[#0B0B0F] ${ri === 0 ? "font-semibold" : ""
                        }`}
                    >
                      {cell == null || cell === "" ? "\u00A0" : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FullScreenPreview({
  file,
  onClose,
}: {
  file: ZipMemberFile;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    const load = async () => {
      if (!file?.preview_url) {
        setError("Missing preview URL");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const result = await openZipMember(file.preview_url);
        if (cancelled) {
          URL.revokeObjectURL(result.objectUrl);
          return;
        }
        createdUrl = result.objectUrl;
        setObjectUrl(result.objectUrl);
        setContentType(result.contentType || "");
        setBlob(result.blob);
      } catch (err) {
        if (cancelled) return;
        setError(libraryErrorMessage(err, "Failed to open file"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [file?.preview_url]);

  const previewKind = isInlinePreviewable(file, contentType);
  const fileLabel = file?.name || file?.path || "File";

  const handleDownload = () => {
    if (!objectUrl) {
      toast.error("File not ready");
      return;
    }
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileLabel;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleOpenTab = () => {
    if (!objectUrl) return;
    window.open(objectUrl, "_blank", "noopener,noreferrer");
  };

  if (!file) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Full screen file preview"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Preview
          </p>
          <h2 className="truncate text-lg font-bold text-[#0B0B0F] sm:text-xl">
            {fileLabel}
          </h2>
          {file?.path && file.path !== file.name && (
            <p className="truncate text-xs text-gray-500">{file.path}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {objectUrl && (
            <>
              <button
                type="button"
                onClick={handleOpenTab}
                className="hidden items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:inline-flex"
              >
                Open tab
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-gray-50">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm">Loading file…</p>
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <FileText className="text-gray-300" size={40} />
            <p className="font-semibold text-gray-700">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-white"
            >
              Back
            </button>
          </div>
        ) : previewKind === "pdf" || previewKind === "image" ? (
          <iframe
            title={fileLabel}
            src={objectUrl || undefined}
            className="h-full w-full border-0 bg-white"
          />
        ) : previewKind === "docx" && blob ? (
          <DocxBlobPreview blob={blob} />
        ) : previewKind === "xlsx" && blob ? (
          <XlsxBlobPreview blob={blob} />
        ) : previewKind === "text" && blob ? (
          <TextBlobPreview blob={blob} />
        ) : (
          <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-primary/15 bg-white shadow-md">
              <File className="text-primary" size={40} />
            </div>
            <div>
              <p className="text-base font-semibold text-[#0B0B0F]">{fileLabel}</p>
              <p className="mt-2 text-sm text-gray-500">
                This file type can’t be previewed in the browser. Download it or
                open with an external viewer.
              </p>
              {(file?.mime_type || file?.content_type || contentType) && (
                <p className="mt-1 text-xs text-gray-400">
                  {file?.mime_type || file?.content_type || contentType}
                  {file?.size_bytes != null
                    ? ` · ${formatBytes(file.size_bytes)}`
                    : ""}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

type TeamSession = {
  team_id?: string;
  student_id?: string;
  student_name?: string;
  project_id?: string;
  project_brief_title?: string;
  project_brief_summary?: string;
  project_brief?: string;
  project_zip_name?: string;
};

export default function ProjectZipsClient() {
  const router = useRouter();
  const params = useParams<{ team_id: string }>();
  const teamId = params?.team_id || "";

  const [studentName, setStudentName] = useState("Student");
  const [briefTitle, setBriefTitle] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [zipName, setZipName] = useState("");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<ZipMemberFile[]>([]);
  const [previewFile, setPreviewFile] = useState<ZipMemberFile | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !teamId) return;
    try {
      const raw = sessionStorage.getItem(`library-team-${teamId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as TeamSession;
      if (parsed.student_name) setStudentName(parsed.student_name);
      if (parsed.project_brief_title) setBriefTitle(parsed.project_brief_title);
      const summary = parsed.project_brief_summary || parsed.project_brief;
      if (summary) setBriefSummary(summary);
      if (parsed.project_zip_name) setZipName(parsed.project_zip_name);
    } catch {
      /* ignore */
    }
  }, [teamId]);

  useEffect(() => {
    if (!teamId) {
      setLoading(false);
      setLoadError("Missing team id");
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const res = await getTeamZipContents(teamId);
        if (cancelled) return;
        const data = res?.data;
        if (data?.zip_name) setZipName(data.zip_name);
        setFiles(Array.isArray(data?.files) ? data.files : []);
      } catch (err) {
        if (cancelled) return;
        setFiles([]);
        setLoadError(libraryErrorMessage(err, "Failed to load zip contents"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [teamId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (f) =>
        (f.name || "").toLowerCase().includes(q) ||
        (f.path || "").toLowerCase().includes(q),
    );
  }, [files, search]);

  if (loading && files.length === 0 && !loadError) {
    return (
      <AppShell>
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-full space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push("/library")}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Library
            </button>
            <h1 className="truncate text-2xl font-bold text-[#0B0B0F]">
              {studentName}
              <span className="ml-2 text-base font-medium text-gray-400">
                Library
              </span>
            </h1>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {briefTitle ||
                briefSummary ||
                zipName ||
                `Zip contents for team ${teamId || ""}`.trim()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files…"
                className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-md p-2 transition ${view === "grid" ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-50"}`}
                title="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-md p-2 transition ${view === "list" ? "bg-primary/10 text-primary" : "text-gray-500 hover:bg-gray-50"}`}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FolderOpen size={16} className="text-primary" />
          <span className="font-medium text-[#0B0B0F]">Library</span>
          <span className="text-gray-300">/</span>
          <span className="truncate">{studentName}</span>
          {zipName && (
            <>
              <span className="text-gray-300">/</span>
              <span className="truncate text-gray-500">{zipName}</span>
            </>
          )}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} file{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {loadError ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
            <FileArchive className="mx-auto text-red-300" size={40} />
            <p className="mt-3 font-semibold text-red-700">{loadError}</p>
            <button
              type="button"
              onClick={() => router.push("/library")}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Back to Library
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <FileArchive className="mx-auto text-gray-300" size={40} />
            <p className="mt-3 font-semibold text-gray-700">No files found</p>
            <p className="text-sm text-gray-500">
              {search ? "Try a different search term" : "This zip has no files"}
            </p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((file) => (
              <article
                key={file.path || file.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
              >
                <FileTypeThumb file={file} size="lg" />

                <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                  <div className="min-w-0">
                    <h3
                      className="truncate font-semibold text-[#0B0B0F]"
                      title={file.name}
                    >
                      {file.name || file.path}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-gray-500" title={file.path}>
                      {file.path}
                    </p>
                  </div>

                  <div className="mt-auto flex min-w-0 items-center justify-between gap-2 text-xs text-gray-500">
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <HardDrive size={12} />
                      {formatBytes(file.size_bytes)}
                    </span>
                    <span
                      className="max-w-[45%] truncate rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600"
                      title={file.mime_type || file.content_type || formatTypeLabel(file)}
                    >
                      {formatTypeLabel(file)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    disabled={!file.preview_url}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-40"
                  >
                    <Eye size={16} />
                    Open
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Name
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:table-cell">
                    Path
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                    Size
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((file) => (
                  <tr
                    key={file.path || file.name}
                    className="transition hover:bg-primary/5"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileTypeThumb file={file} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#0B0B0F]">
                            {file.name || file.path}
                          </p>
                          <p className="truncate text-xs text-gray-500 sm:hidden">
                            {formatTypeLabel(file)} · {formatBytes(file.size_bytes)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden max-w-xs px-5 py-3.5 text-sm text-gray-600 sm:table-cell">
                      <span className="block truncate" title={file.path}>
                        {file.path}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-gray-600 md:table-cell">
                      {formatBytes(file.size_bytes)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        disabled={!file.preview_url}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        <Eye size={14} />
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {previewFile && (
          <FullScreenPreview
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
