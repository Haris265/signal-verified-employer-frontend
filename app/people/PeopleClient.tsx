"use client";

import { AppShell } from "@/components/AppShell";
import { LoadingState } from "@/components/ui/LoadingState";
import { ApiError, getPeopleView } from "@/lib/api";
import type { PeopleRow } from "@/lib/types";
import { Loader2, Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function rowHref(row: PeopleRow) {
  const assignmentId = row.assignment_id || row.id;
  if (!row.project_id || !assignmentId) return null;
  return `/projects/${row.project_id}/participants/${assignmentId}`;
}

export default function PeopleClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rows, setRows] = useState<PeopleRow[]>([]);
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
        const res = await getPeopleView(debouncedSearch);
        if (cancelled) return;
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (cancelled) return;
        setRows([]);
        toast.error(err instanceof ApiError ? err.message : "Failed to load people");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

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
            <h1 className="text-2xl font-bold text-[#0B0B0F]">People</h1>
            <p className="mt-1 text-sm text-gray-500">
              Candidates participating in your projects
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
              placeholder="Search name or email…"
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
                    Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                    Email
                  </th>
                  <th className="hidden px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wide text-gray-500 md:table-cell">
                    Project name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.length > 0 ? (
                  rows.map((row) => {
                    const href = rowHref(row);
                    return (
                      <tr key={row.id} className="transition hover:bg-primary/5">
                        <td className="px-6 py-4">
                          {href ? (
                            <Link href={href} className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-primary">
                                <User size={18} />
                              </div>
                              <p className="truncate font-semibold text-[#0B0B0F]">
                                {row.name || "—"}
                              </p>
                            </Link>
                          ) : (
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-primary">
                                <User size={18} />
                              </div>
                              <p className="truncate font-semibold text-[#0B0B0F]">
                                {row.name || "—"}
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="max-w-xs px-6 py-4">
                          {href ? (
                            <Link href={href} className="block truncate text-sm text-gray-600">
                              {row.email || "—"}
                            </Link>
                          ) : (
                            <p className="truncate text-sm text-gray-600">
                              {row.email || "—"}
                            </p>
                          )}
                        </td>
                        <td className="hidden max-w-sm px-6 py-4 md:table-cell">
                          {href ? (
                            <Link href={href} className="block truncate text-sm text-gray-600">
                              {row.project_name || "—"}
                            </Link>
                          ) : (
                            <p className="truncate text-sm text-gray-600">
                              {row.project_name || "—"}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      {loading ? "Loading…" : "No candidates found"}
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
