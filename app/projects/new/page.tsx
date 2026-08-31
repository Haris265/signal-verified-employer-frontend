"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import { LoadingState } from "@/components/ui/LoadingState";
import { Spinner } from "@/components/ui/Spinner";
import { requestProject, getEntitlement, ApiError } from "@/lib/api";
import {
  canRequestNewProject,
  clampFinalistCount,
  finalistBounds,
} from "@/lib/entitlement";
import type { Entitlement } from "@/lib/types";

function RequestProjectInner() {
  const router = useRouter();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [entLoaded, setEntLoaded] = useState(false);
  const [engagementType, setEngagementType] = useState<1 | 2>(1);
  const [roleName, setRoleName] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [count, setCount] = useState(() => finalistBounds(1).defaultCount);
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bounds = finalistBounds(engagementType);
  const canRequest = canRequestNewProject(entitlement);

  useEffect(() => {
    getEntitlement()
      .then((res) => setEntitlement(res.data?.primary || null))
      .catch(() => setEntitlement(null))
      .finally(() => setEntLoaded(true));
  }, []);

  function setType(next: 1 | 2) {
    setEngagementType(next);
    setCount((prev) => clampFinalistCount(next, prev));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!canRequest) {
      setError("Your organization does not have an active license to request new projects.");
      return;
    }
    if (!jdText.trim() && !jdFile) {
      setError("Provide a job/program description as text or upload a PDF.");
      return;
    }
    const finalCount = clampFinalistCount(engagementType, count);
    if (finalCount !== count) setCount(finalCount);

    setLoading(true);
    try {
      await requestProject({
        engagement_type: engagementType,
        requested_role_name: roleName.trim(),
        requested_jd_text: jdText,
        requested_jd_file: jdFile,
        requested_finalist_count: finalCount,
        target_completion_date: targetDate,
        notes_to_ops: notes,
      });
      router.push("/projects?requested=1");
    } catch (err) {
      setError(err instanceof ApiError || err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  if (entLoaded && !canRequest) {
    return (
      <AppShell entitlement={entitlement}>
        <Link href="/projects" className="text-sm font-medium text-primary hover:underline">
          ← Projects
        </Link>
        <h1 className="mt-3 text-[1.875rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[2rem]">
          Request new project
        </h1>
        <div className="mt-6 max-w-xl rounded-lg border border-border bg-secondary/50 px-4 py-4 text-sm text-muted-foreground">
          <p>
            {entitlement?.display_text ||
              "New projects require an active contractual license. Contact SignalVerified to unlock this."}
          </p>
          <a
            href="mailto:questions@signalverified.net?subject=License%20inquiry"
            className="mt-3 inline-block font-medium text-primary underline-offset-4 hover:underline"
          >
            Contact sales
          </a>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell entitlement={entitlement}>
      <Link href="/projects" className="text-sm font-medium text-primary hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-3 text-[1.875rem] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[2rem]">
        Request new project
      </h1>
      <p className="mt-2 max-w-2xl text-sm font-normal text-muted-foreground">
        Submit a lightweight intake. SignalVerified will reach out within one business day to
        schedule your scoping call. No payment or calendar booking in this step.
      </p>

      <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5 card-surface p-6">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">Project type</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="engagement_type"
                checked={engagementType === 1}
                onChange={() => setType(1)}
              />
              Hiring
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="engagement_type"
                checked={engagementType === 2}
                onChange={() => setType(2)}
              />
              Program
            </label>
          </div>
        </fieldset>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="role">
            Role or program name
          </label>
          <input
            id="role"
            required
            className="input-field"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="jd">
            Job description or program description
          </label>
          <textarea
            id="jd"
            rows={5}
            className="input-field"
            placeholder="Paste description…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
          <div className="mt-2">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground" htmlFor="jdfile">
              Or upload PDF
            </label>
            <input
              id="jdfile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-foreground"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="count">
              {engagementType === 1
                ? "Expected number of finalists"
                : "Expected number of participants"}
            </label>
            <input
              id="count"
              type="number"
              min={bounds.min}
              max={bounds.max}
              required
              className="input-field"
              value={count}
              onChange={(e) =>
                setCount(clampFinalistCount(engagementType, Number(e.target.value)))
              }
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              {engagementType === 1
                ? `Hiring decisions use Signal for late-stage finalists (${bounds.min}–${bounds.max}).`
                : `Programs may include more participants (${bounds.min}–${bounds.max}).`}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="date">
              Target completion date
            </label>
            <input
              id="date"
              type="date"
              required
              className="input-field"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="notes">
            Notes for the SignalVerified team (optional)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="input-field"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-[0.625rem] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner variant="inline" className="h-4 w-4 border-white/30 border-t-white" />
                Submitting…
              </span>
            ) : (
              "Submit request"
            )}
          </button>
          <Link href="/projects" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}

export default function RequestProjectPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState />}>
        <RequestProjectInner />
      </Suspense>
    </RequireEmployer>
  );
}
