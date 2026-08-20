"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RequireEmployer } from "@/components/RequireEmployer";
import { requestProject, getEntitlement, ApiError } from "@/lib/api";
import type { Entitlement } from "@/lib/types";
import { useEffect } from "react";

function RequestProjectInner() {
  const router = useRouter();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [engagementType, setEngagementType] = useState<1 | 2>(1);
  const [roleName, setRoleName] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [count, setCount] = useState(8);
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEntitlement()
      .then((res) => setEntitlement(res.data?.primary || null))
      .catch(() => undefined);
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!jdText.trim() && !jdFile) {
      setError("Provide a job/program description as text or upload a PDF.");
      return;
    }
    setLoading(true);
    try {
      await requestProject({
        engagement_type: engagementType,
        requested_role_name: roleName.trim(),
        requested_jd_text: jdText,
        requested_jd_file: jdFile,
        requested_finalist_count: count,
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

  return (
    <AppShell entitlement={entitlement}>
      <Link href="/projects" className="text-sm font-medium text-brand-600 hover:underline">
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
                onChange={() => setEngagementType(1)}
              />
              Hiring
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="engagement_type"
                checked={engagementType === 2}
                onChange={() => setEngagementType(2)}
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
              Expected number of finalists or participants
            </label>
            <input
              id="count"
              type="number"
              min={1}
              required
              className="input-field"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
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
            {loading ? "Submitting…" : "Submit request"}
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
      <Suspense fallback={<div className="p-10 text-sm text-muted-foreground">Loading…</div>}>
        <RequestProjectInner />
      </Suspense>
    </RequireEmployer>
  );
}
