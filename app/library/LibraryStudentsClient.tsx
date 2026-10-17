"use client";

import { Eye, FileText, Search, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { STATIC_STUDENTS } from "@/lib/library/data";

export default function LibraryStudentsClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const students = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [...STATIC_STUDENTS];
    return STATIC_STUDENTS.filter(
      (s) =>
        s.student_name.toLowerCase().includes(q) ||
        s.project_brief.toLowerCase().includes(q),
    );
  }, [search]);

  const openLibrary = (student: (typeof STATIC_STUDENTS)[number]) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `library-student-${student.id}`,
        JSON.stringify({
          student_name: student.student_name,
          student_brief: student.project_brief,
          project_brief: student.project_brief,
        }),
      );
    }
    router.push(`/library/${student.id}`);
  };

  const openBriefPdf = (student: (typeof STATIC_STUDENTS)[number]) => {
    if (!student?.brief_pdf_url) {
      toast.error("Brief PDF not available");
      return;
    }
    window.open(student.brief_pdf_url, "_blank", "noopener,noreferrer");
  };

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
              placeholder="Search student or project brief…"
              className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
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
                    Project Brief
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
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-primary/5"
                    >
                      <td className="px-6 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-primary">
                            <User size={18} />
                          </div>
                          <p className="truncate font-semibold text-[#0B0B0F]">
                            {student.student_name}
                          </p>
                        </div>
                      </td>
                      <td className="max-w-xl px-6 py-4">
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {student.project_brief}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => openBriefPdf(student)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                          title="View project brief PDF"
                        >
                          <FileText size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openLibrary(student)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No students found
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
