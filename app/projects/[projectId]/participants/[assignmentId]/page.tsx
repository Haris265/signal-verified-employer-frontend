"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import { CandidateResultsSummary } from "@/components/report/CandidateResultsSummary";
import { LoadingState } from "@/components/ui/LoadingState";
import { getEntitlement, getParticipantDetail, ApiError } from "@/lib/api";
import { mapParticipantToReport } from "@/lib/mapParticipantReport";
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

/** B2B Signal: full Candidate Results Summary report. */
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
        <LoadingState />
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

      <CandidateResultsSummary report={mapParticipantToReport(detail)} />
    </AppShell>
  );
}

export default function ParticipantDetailPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState />}>
        <ParticipantDetailInner />
      </Suspense>
    </RequireEmployer>
  );
}
