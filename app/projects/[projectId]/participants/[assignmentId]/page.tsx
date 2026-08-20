"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import { getEntitlement, getParticipantDetail, ApiError } from "@/lib/api";
import type { Entitlement, ParticipantDetail } from "@/lib/types";

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
        <p className="text-sm text-muted-foreground">Loading participant…</p>
      </AppShell>
    );
  }

  if (error || !detail) {
    return (
      <AppShell entitlement={entitlement}>
        <Link
          href={`/projects/${projectId}`}
          className="text-sm font-medium text-brand-600 hover:underline"
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
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/projects/${projectId}`}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          ← {detail.project.name}
        </Link>
        <div className="flex gap-2">
          {detail.the_signal_url && (
            <a
              href={detail.the_signal_url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              View TheSignal
            </a>
          )}
          <button type="button" className="btn-secondary" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <article className="print-area card-surface p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">
          {detail.project.name} · {detail.project.engagement_type}
        </p>
        <h1 className="mt-1 text-[1.875rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[2rem]">
          {detail.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{detail.role}</p>

        <div className="mt-8 rounded-[0.625rem] bg-brand-50 p-8 text-center ring-1 ring-brand-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-brand-600">
            {detail.designation || "—"}
          </p>
          {detail.overall_score != null && (
            <p className="mt-2 text-sm text-muted-foreground">
              Overall score {detail.overall_score.toFixed(2)} / 4.00
            </p>
          )}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Evidence summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {detail.evidence_summary || "No evidence summary available yet."}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Capabilities</h2>
          <div className="mt-4 space-y-4">
            {detail.capabilities.map((cap) => (
              <div key={cap.capability} className="rounded-[0.625rem] border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{cap.capability}</p>
                  <p className="text-sm text-muted-foreground">
                    {cap.score != null ? `${cap.score.toFixed(2)} · ${cap.label || ""}` : "—"}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{
                      width: `${cap.score != null ? Math.min((cap.score / 4) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Strengths</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
              {(detail.strengths || []).length > 0 ? (
                detail.strengths.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li className="list-none pl-0 text-muted-foreground">None listed yet.</li>
              )}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Watch areas</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
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
