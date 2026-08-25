"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import { getEntitlement, getParticipantDetail, ApiError } from "@/lib/api";
import type { Entitlement, ParticipantDetail } from "@/lib/types";

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

/** B2B Signal: HTML document with final score only — no capability buckets. */
function ParticipantDetailInner() {
  const params = useParams();
  const projectId = String(params.projectId || "");
  const assignmentId = String(params.assignmentId || "");
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [detail, setDetail] = useState<ParticipantDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [ent, d] = await Promise.all([
          getEntitlement(),
          getParticipantDetail(assignmentId),
        ]);
        if (cancelled) return;
        setEntitlement(ent.data?.primary || null);
        setDetail(d.data || null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load participant");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (assignmentId) load();
    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  if (loading) {
    return (
      <AppShell entitlement={entitlement}>
        <p className="text-sm text-muted-foreground">Loading Signal…</p>
      </AppShell>
    );
  }

  if (error || !detail) {
    return (
      <AppShell entitlement={entitlement}>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to project
        </Link>
        <div className="mt-6 rounded-[0.625rem] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error || "participant not found"}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell entitlement={entitlement}>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/projects/${projectId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← {detail.project.name}
        </Link>
        <div className="flex flex-wrap gap-2">
          {detail.the_signal_url && (
            <a
              href={detail.the_signal_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <DownloadIcon />
              Download PDF
            </a>
          )}
          <button
            type="button"
            className="btn-secondary inline-flex items-center gap-2"
            onClick={() => window.print()}
          >
            <DownloadIcon />
            {detail.the_signal_url ? "Print" : "Download PDF"}
          </button>
        </div>
      </div>

      <article className="print-area card-surface mx-auto max-w-3xl p-6 sm:p-10">
        <header className="border-b border-border pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            The Signal · B2B
          </p>
          <h1 className="mt-3 text-[1.875rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[2rem]">
            {detail.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{detail.role}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {detail.project.name} · {detail.project.engagement_type}
          </p>
        </header>

        <div className="mt-8 rounded-[0.625rem] border border-border bg-secondary/50 px-6 py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Final result
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-primary">
            {detail.designation || "—"}
          </p>
          {detail.overall_score != null && (
            <p className="mt-3 text-sm tabular-nums text-foreground">
              Overall score{" "}
              <span className="font-semibold">{detail.overall_score.toFixed(2)}</span>
              <span className="text-muted-foreground"> / 4.00</span>
            </p>
          )}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Evidence summary</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {detail.evidence_summary || "No evidence summary available yet."}
          </p>
        </section>

        <div className="mt-10 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Strengths</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
              {(detail.strengths || []).length > 0 ? (
                detail.strengths.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li className="list-none pl-0 text-muted-foreground">None listed yet.</li>
              )}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Watch areas</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground">
              {(detail.watch_areas || []).length > 0 ? (
                detail.watch_areas.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li className="list-none pl-0 text-muted-foreground">None listed yet.</li>
              )}
            </ul>
          </section>
        </div>
      </article>
    </AppShell>
  );
}

export default function ParticipantDetailPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading…</div>}>
        <ParticipantDetailInner />
      </Suspense>
    </RequireEmployer>
  );
}
