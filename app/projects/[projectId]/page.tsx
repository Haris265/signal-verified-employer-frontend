"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import {
  getEntitlement,
  getParticipants,
  getProjectDetail,
  getProjects,
  ApiError,
} from "@/lib/api";
import type { Entitlement, ParticipantRow, ProjectCard, ProjectDetail } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeResult(row: ParticipantRow): string {
  if (row.status === "No Consent") return "No Consent";
  if (!row.result) return "Pending";
  return row.result;
}

const RESULT_BAR: Record<string, string> = {
  Verified: "bg-primary",
  Exceptional: "bg-primary",
  Meets: "bg-primary",
  Emerging: "bg-primary/55",
  Developing: "bg-primary/25",
  Pending: "bg-border",
  "No Consent": "bg-primary",
};

const RESULT_DOT: Record<string, string> = {
  Verified: "bg-primary",
  Exceptional: "bg-primary",
  Meets: "bg-primary",
  Emerging: "bg-primary/55",
  Developing: "bg-primary/25",
  Pending: "bg-border",
  "No Consent": "bg-primary",
};

function ResultBadge({ result }: { result: string }) {
  const isVerified = result === "Verified" || result === "Exceptional" || result === "Meets";
  const isMuted = result === "No Consent";

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">
        <ShieldCheckIcon />
        {result}
      </span>
    );
  }

  if (isMuted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        <LockIcon />
        {result}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
      <CircleIcon />
      {result}
    </span>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden>
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-muted-foreground transition group-open:rotate-180" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ProjectDetailInner() {
  const params = useParams();
  const projectId = String(params.projectId || "");
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [detail, setDetail] = useState<ProjectDetail | null>(null);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [tableLabel, setTableLabel] = useState("Participants");
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [ent, d, p, list] = await Promise.all([
          getEntitlement(),
          getProjectDetail(projectId),
          getParticipants(projectId),
          getProjects(),
        ]);
        if (cancelled) return;
        setEntitlement(ent.data?.primary || null);
        setDetail(d.data || null);
        setParticipants(p.data?.participants || []);
        setTableLabel(p.data?.table_label || d.data?.table_label || "Participants");
        setProjects((list.data?.projects || []).filter((x) => x.view_enabled));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (projectId) load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const resultCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const row of participants) {
      const key = normalizeResult(row);
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [participants]);

  const resultOrder = useMemo(() => {
    const preferred = [
      "Verified",
      "Exceptional",
      "Meets",
      "Emerging",
      "Developing",
      "Pending",
      "No Consent",
    ];
    const keys = Object.keys(resultCounts);
    return [
      ...preferred.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !preferred.includes(k)),
    ];
  }, [resultCounts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = participants.filter((row) => {
      if (resultFilter !== "All" && normalizeResult(row) !== resultFilter) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q);
    });
    rows = [...rows].sort((a, b) => {
      const av = a.overall_score;
      const bv = b.overall_score;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortDesc ? bv - av : av - bv;
    });
    return rows;
  }, [participants, search, resultFilter, sortDesc]);

  if (loading) {
    return (
      <AppShell entitlement={entitlement} mainClassName="py-12">
        <p className="text-sm text-muted-foreground">Loading project…</p>
      </AppShell>
    );
  }

  if (error || !detail) {
    return (
      <AppShell entitlement={entitlement} mainClassName="py-12">
        <Link href="/projects" className="text-sm text-muted-foreground transition hover:text-foreground">
          ← Projects
        </Link>
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || "project not found"}
        </div>
      </AppShell>
    );
  }

  const dateRange = [formatDate(detail.start_date), formatDate(detail.end_date)]
    .filter(Boolean)
    .join(" – ");
  const partnerBits = [entitlement?.name, detail.partner_name].filter(Boolean);
  const totalForDist = participants.length || 1;

  return (
    <AppShell entitlement={entitlement} mainClassName="py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/projects"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Projects
        </Link>
        <details className="group relative print:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-input bg-background px-3 py-1.5 text-sm text-foreground transition hover:bg-secondary">
            <span className="max-w-[16rem] truncate">{detail.name}</span>
            <ChevronDownIcon />
          </summary>
          <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg">
            <div className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Switch project
            </div>
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`block truncate rounded-lg px-2.5 py-2 text-sm transition hover:bg-secondary ${
                  p.id === projectId ? "text-foreground" : "text-foreground"
                }`}
              >
                {p.name}
              </Link>
            ))}
            <Link
              href="/projects"
              className="mt-1 block border-t border-border px-2.5 py-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              View all projects
            </Link>
          </div>
        </details>
      </div>

      {partnerBits.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          {partnerBits.map((bit, i) => (
            <span key={`${bit}-${i}`} className="contents">
              {i > 0 && <span className="text-border">×</span>}
              <span
                className={
                  i === 0
                    ? "text-[11px] font-semibold uppercase tracking-[0.32em] text-foreground"
                    : "font-semibold tracking-[0.28em]"
                }
              >
                {bit}
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{detail.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {detail.engagement_type}
            {dateRange ? ` · ${dateRange}` : ""}
          </p>
          <a
            href="#project-insights"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:underline"
          >
            <FileTextIcon />
            View project brief
          </a>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:bg-secondary"
        >
          <DownloadIcon />
          Download summary
        </button>
      </div>

      <div className="mt-6 max-w-md">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{detail.progress.percent}% complete</span>
          <span>
            {detail.progress.complete} of {detail.progress.participants}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(detail.progress.percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
        {[
          { label: "Participants", value: detail.metrics.participants },
          { label: "Complete", value: detail.metrics.complete },
          {
            label: detail.metrics.verified_or_meets_label,
            value: detail.metrics.verified_or_meets,
          },
          { label: "In Review", value: detail.metrics.in_review },
        ].map((m) => (
          <div key={m.label} className="bg-card px-6 py-5">
            <div className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              {m.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      {participants.length > 0 && (
        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Result Distribution
          </h2>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-secondary">
            {resultOrder.map((key) => {
              const count = resultCounts[key] || 0;
              if (!count) return null;
              return (
                <div
                  key={key}
                  title={`${key}: ${count}`}
                  className={`h-full ${RESULT_BAR[key] || "bg-primary/40"}`}
                  style={{ width: `${(count / totalForDist) * 100}%` }}
                />
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {resultOrder.map((key) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span className={`h-2.5 w-2.5 rounded-full ${RESULT_DOT[key] || "bg-primary/40"}`} />
                <span className="text-foreground">{key}</span>
                <span className="tabular-nums text-muted-foreground">{resultCounts[key]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{tableLabel}</h2>
          <div className="relative">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setResultFilter("All")}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              resultFilter === "All"
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {resultOrder.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setResultFilter(key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                resultFilter === key
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {key}
              <span className="ml-1.5 tabular-nums text-xs text-muted-foreground">
                {resultCounts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Result</th>
                <th className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSortDesc((v) => !v)}
                    className="inline-flex items-center gap-1 uppercase tracking-wider text-foreground transition hover:text-foreground"
                  >
                    Score
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden>
                      <path d="M12 5v14" />
                      <path d={sortDesc ? "m19 12-7 7-7-7" : "m5 12 7-7 7 7"} />
                    </svg>
                  </button>
                </th>
                <th className="w-10 px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const result = normalizeResult(row);
                const href = `/projects/${projectId}/participants/${row.id}`;
                return (
                  <tr
                    key={row.id}
                    className="group border-b border-border transition last:border-0 hover:bg-secondary/60"
                  >
                    <td className="p-0">
                      <Link href={href} className="flex items-center px-6 py-3.5 font-medium text-foreground">
                        {row.name}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={href} className="flex items-center px-6 py-3.5 text-muted-foreground">
                        {row.status}
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link href={href} className="flex items-center px-6 py-3.5">
                        <ResultBadge result={result} />
                      </Link>
                    </td>
                    <td className="p-0">
                      <Link
                        href={href}
                        className="flex items-center justify-end px-6 py-3.5 text-right tabular-nums text-foreground"
                      >
                        {row.overall_score != null ? (
                          <>
                            {row.overall_score.toFixed(2)}
                            <span className="ml-1 text-xs text-muted-foreground">/ 4.00</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <ChevronRightIcon />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No participants to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="project-insights" className="mt-16">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Project Insights</h2>
        <div className="mt-5 grid gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-2">
          <div className="space-y-6">
            {detail.insights.capability_scores.map((cap) => (
              <div key={cap.capability}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-foreground">{cap.capability}</span>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {cap.score != null ? (
                      <>
                        {cap.score.toFixed(1)}{" "}
                        <span className="text-xs text-muted-foreground/70">/ 4.0</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${
                          cap.score != null ? Math.min((cap.score / 4) * 100, 100) : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {detail.insights.capability_scores.length === 0 && (
              <p className="text-sm text-muted-foreground">No capability scores yet.</p>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                Strongest Capability
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {detail.insights.strongest_capability || "—"}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                Development Opportunity
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {detail.insights.development_opportunity || "—"}
              </p>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">
                Overall Observation
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {detail.insights.overall_observation || "—"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

export default function ProjectDetailPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading…</div>}>
        <ProjectDetailInner />
      </Suspense>
    </RequireEmployer>
  );
}
