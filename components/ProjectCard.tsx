import Link from "next/link";
import type { ProjectCard } from "@/lib/types";

function formatDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ArrowUpRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary"
      aria-hidden
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

export function ProjectCardItem({ project }: { project: ProjectCard }) {
  const dateRange = [formatDate(project.start_date), formatDate(project.end_date)]
    .filter(Boolean)
    .join(" – ");

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {project.engagement_type}
          </div>
          {project.awaiting_scoping && (
            <span className="mb-2 ml-2 inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-100">
              Awaiting scoping call
            </span>
          )}
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{project.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {[project.partner_name, dateRange].filter(Boolean).join(" · ")}
          </p>
        </div>
        {project.view_enabled && <ArrowUpRight />}
      </div>
      <div className="mt-8 flex items-center gap-6 border-t border-border pt-5 text-sm">
        <div>
          <div className="text-xl font-semibold tabular-nums tracking-tight text-foreground">
            {project.participant_count}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">Participants</div>
        </div>
        <div>
          <div className="text-xl font-semibold tabular-nums tracking-tight text-foreground">
            {project.status_counts?.Complete || 0}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">Complete</div>
        </div>
        <div>
          <div className="text-xl font-semibold tabular-nums tracking-tight text-foreground">
            {project.status_counts?.["In Review"] || 0}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">In Review</div>
        </div>
      </div>
    </>
  );

  const cardClass =
    "group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-cardHover";

  if (!project.view_enabled) {
    return <div className={`${cardClass} cursor-not-allowed opacity-85`}>{inner}</div>;
  }

  return (
    <Link href={`/projects/${project.id}`} className={cardClass}>
      {inner}
    </Link>
  );
}
