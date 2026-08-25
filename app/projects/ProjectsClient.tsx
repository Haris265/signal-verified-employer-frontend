"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProjectCardItem } from "@/components/ProjectCard";
import { getEntitlement, getProjects, ApiError } from "@/lib/api";
import { canRequestNewProject } from "@/lib/entitlement";
import type { Entitlement, ProjectCard } from "@/lib/types";

type Filter = "All" | "Programs" | "Hiring" | "Archived";

function PlusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.34-4.34" />
    </svg>
  );
}

export default function ProjectsClient() {
  const searchParams = useSearchParams();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const banner = searchParams.get("requested");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [ent, proj] = await Promise.all([getEntitlement(), getProjects()]);
        if (cancelled) return;
        setEntitlement(ent.data?.primary || null);
        setProjects(proj.data?.projects || []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load projects");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === "Programs" && p.engagement_type !== "Program") return false;
      if (filter === "Hiring" && p.engagement_type !== "Hiring") return false;
      if (filter === "Archived" && p.status !== "Archived") return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.partner_name || "").toLowerCase().includes(q) ||
        p.engagement_type.toLowerCase().includes(q)
      );
    });
  }, [projects, filter, query]);

  const activeCount = projects.filter(
    (p) => p.status === "Active" || p.status === "Scoping" || p.status === "Requested"
  ).length;

  const canRequest = canRequestNewProject(entitlement);
  const licenseHint =
    entitlement?.display_text ||
    "New projects require an active license. Contact SignalVerified to continue.";

  return (
    <AppShell entitlement={entitlement}>
      {banner && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Thanks. Someone from SignalVerified will reach out within one business day to schedule
          your scoping call.
        </div>
      )}

      <span className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground">
        {entitlement?.name || "Organization"}
      </span>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Your SignalVerified Projects
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCount} active project{activeCount === 1 ? "" : "s"} · Updated today
          </p>
        </div>
        {canRequest ? (
          <Link href="/projects/new" className="btn-primary">
            <PlusIcon />
            New project
          </Link>
        ) : (
          <span
            title={licenseHint}
            className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-lg bg-primary/40 px-4 text-sm font-medium text-primary-foreground opacity-60"
          >
            <PlusIcon />
            New project
          </span>
        )}
      </div>

      {!canRequest && !loading && (
        <p className="mt-3 text-sm text-muted-foreground">
          {licenseHint}{" "}
          <a
            href="mailto:questions@signalverified.net?subject=License%20inquiry"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Contact sales
          </a>
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-1">
          {(["All", "Programs", "Hiring", "Archived"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${
                filter === f
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="h-9 w-64 rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
        </div>
      </div>

      {loading && <p className="mt-10 text-sm text-muted-foreground">Loading projects…</p>}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCardItem key={project.id} project={project} />
          ))}
          {canRequest ? (
            <Link
              href="/projects/new"
              className="flex min-h-[11rem] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              <PlusIcon className="h-5 w-5" />
              Start a new project
              <span className="text-xs text-muted-foreground">
                Programs and hiring cohorts live side by side
              </span>
            </Link>
          ) : (
            <div
              title={licenseHint}
              className="flex min-h-[11rem] cursor-not-allowed flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-secondary/40 p-6 text-sm text-muted-foreground opacity-60"
            >
              <PlusIcon className="h-5 w-5" />
              Start a new project
              <span className="max-w-[14rem] text-center text-xs text-muted-foreground">
                Available with an active contractual license
              </span>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
