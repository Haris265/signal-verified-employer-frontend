"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiError } from "@/lib/api";
import { getLibrary, type LibraryRow } from "@/lib/library/api";
import { Eye, FileText, Loader2, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LibraryStudentsClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getLibrary(debouncedSearch);
        if (cancelled) return;
        setRows(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        if (cancelled) return;
        setRows([]);
        toast.error(err instanceof ApiError ? err.message : "Failed to load library");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const openLibrary = (row: LibraryRow) => {
    if (!row?.has_project_zip || !row?.team_id) {
      toast.error("Project zip not available");
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `library-team-${row.team_id}`,
        JSON.stringify({
          team_id: row.team_id,
          student_id: row.student_id,
          student_name: row.student_name,
          project_id: row.project_id,
          project_brief_title: row.project_brief_title,
          project_brief_summary: row.project_brief_summary,
          project_zip_name: row.project_zip_name,
        }),
      );
    }
    router.push(`/library/${row.team_id}`);
  };

  const openBriefPdf = (row: LibraryRow) => {
    const url = row?.brief_documents?.[0]?.file_url;
    if (!url) {
      toast.error("Brief PDF not available");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading && rows.length === 0) {
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
          <div>
            <h1 className="text-2xl font-bold text-[#0B0B0F]">Library</h1>
            <p className="mt-1 text-sm text-gray-500">
              Select a student to preview their project packages
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or project…"
              className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
            {loading && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary"
              />
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Student Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Brief title
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
                    Brief PDF
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const briefDoc = row.brief_documents?.[0];
                    const rowKey = `${row.team_id}-${row.student_id}`;
                    return (
                      <tr
                        key={rowKey}
                        className="transition hover:bg-primary/5"
                      >
                        <td className="px-6 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-primary">
                              <User size={18} />
                            </div>
                            <p className="truncate font-semibold text-[#0B0B0F]">
                              {row.student_name || "—"}
                            </p>
                          </div>
                        </td>
                        <td className="max-w-xl px-6 py-4">
                          <p className="line-clamp-1 text-sm font-medium text-[#0B0B0F]">
                            {row.project_brief_title || "—"}
                          </p>
                          {row.project_brief_summary && (
                            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
                              {row.project_brief_summary}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => openBriefPdf(row)}
                            disabled={!briefDoc?.file_url}
                            className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            title={briefDoc?.doc_name || "View project brief PDF"}
                          >
                            <FileText size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openLibrary(row)}
                            disabled={!row.has_project_zip}
                            title={
                              row.has_project_zip
                                ? `Preview ${row.project_zip_name || "zip"}`
                                : "Project zip not available"
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-primary/5 disabled:hover:text-primary"
                          >
                            <Eye size={14} />
                            Preview
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {loading ? "Loading…" : "No library rows found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
