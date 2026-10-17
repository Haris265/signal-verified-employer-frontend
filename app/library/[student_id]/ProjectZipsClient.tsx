"use client";

import {
  ArrowLeft,
  Calendar,
  Download,
  Eye,
  FileArchive,
  FolderOpen,
  Grid3X3,
  HardDrive,
  List,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  getStudentById,
  STATIC_PROJECT_ZIPS,
  type ProjectZip,
} from "@/lib/library/data";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

function FullScreenPreview({
  file,
  onClose,
  onDownload,
}: {
  file: ProjectZip;
  onClose: () => void;
  onDownload: (file: ProjectZip) => void;
}) {
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
            {file.project_name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onDownload(file)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>
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

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-10">
          <div className="flex min-h-64 flex-1 items-center justify-center rounded-3xl border border-primary/10 bg-gradient-to-br from-[#f3f0ff] via-[#ebe6ff] to-white sm:min-h-80">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-primary/15 bg-white shadow-md sm:h-36 sm:w-36">
                <FileArchive className="text-primary" size={64} />
              </div>
              <div>
                <p className="text-base font-semibold text-[#0B0B0F] sm:text-lg">
                  {file.file_name}
                </p>
                <p className="mt-1 text-sm text-gray-500">ZIP package preview</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <FolderOpen size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Project name</p>
                <p className="break-words text-sm font-semibold text-[#0B0B0F]">
                  {file.project_name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <FileArchive size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">File name</p>
                <p className="break-all text-sm font-semibold text-[#0B0B0F]">
                  {file.file_name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <HardDrive size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Size</p>
                <p className="text-sm font-semibold text-[#0B0B0F]">{file.size}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <Calendar size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Modified</p>
                <p className="text-sm font-semibold text-[#0B0B0F]">
                  {formatDate(file.updated_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Library
            </button>
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function ProjectZipsClient() {
  const router = useRouter();
  const params = useParams<{ student_id: string }>();
  const studentId = params?.student_id || "";
  const studentFromData = getStudentById(studentId);

  const [studentName, setStudentName] = useState(
    studentFromData?.student_name || "Student",
  );
  const [studentBrief, setStudentBrief] = useState(
    studentFromData?.project_brief || "",
  );
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [previewFile, setPreviewFile] = useState<ProjectZip | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !studentId) return;
    try {
      const raw = sessionStorage.getItem(`library-student-${studentId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        student_name?: string;
        project_brief?: string;
        student_brief?: string;
      };
      if (parsed.student_name) setStudentName(parsed.student_name);
      const brief = parsed.project_brief || parsed.student_brief;
      if (brief) setStudentBrief(brief);
    } catch {
      /* ignore bad session payload */
    }
  }, [studentId]);

  const files = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [...STATIC_PROJECT_ZIPS];
    return STATIC_PROJECT_ZIPS.filter(
      (f) =>
        f.project_name.toLowerCase().includes(q) ||
        f.file_name.toLowerCase().includes(q),
    );
  }, [search]);

  const handleDownload = (file: ProjectZip) => {
    if (!file?.zip_url) {
      toast.error("Download link not available");
      return;
    }
    window.open(file.zip_url, "_blank", "noopener,noreferrer");
    toast.success(`Downloading ${file.file_name}`);
  };

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
              Back to students
            </button>
            <h1 className="truncate text-2xl font-bold text-[#0B0B0F]">
              {studentName}
              <span className="ml-2 text-base font-medium text-gray-400">
                Library
              </span>
            </h1>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {studentBrief ||
                `Project packages for student ${studentId || ""}`.trim()}
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
                placeholder="Search project or zip…"
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
          <span className="ml-auto text-xs text-gray-400">
            {files.length} item{files.length === 1 ? "" : "s"}
          </span>
        </div>

        {files.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <FileArchive className="mx-auto text-gray-300" size={40} />
            <p className="mt-3 font-semibold text-gray-700">No zips found</p>
            <p className="text-sm text-gray-500">Try a different search term</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => (
              <article
                key={file.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#f3f0ff] to-[#ebe6ff]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-white shadow-sm">
                    <FileArchive className="text-primary" size={32} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="min-w-0">
                    <h3
                      className="truncate font-semibold text-[#0B0B0F]"
                      title={file.project_name}
                    >
                      {file.project_name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {file.file_name}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>{formatDate(file.updated_at)}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  >
                    <Eye size={16} />
                    Preview
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
                    Size
                  </th>
                  <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 md:table-cell">
                    Modified
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {files.map((file) => (
                  <tr key={file.id} className="transition hover:bg-primary/5">
                    <td className="px-5 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f0ff] text-primary">
                          <FileArchive size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#0B0B0F]">
                            {file.project_name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {file.file_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-gray-600 sm:table-cell">
                      {file.size}
                    </td>
                    <td className="hidden px-5 py-3.5 text-sm text-gray-600 md:table-cell">
                      {formatDate(file.updated_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        <Eye size={14} />
                        Preview
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
            onDownload={handleDownload}
          />
        )}
      </div>
    </AppShell>
  );
}
