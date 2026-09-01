import { Logo } from "@/components/Logo";
import type { ParticipantReport } from "@/lib/types/report";
import "./report.css";

function TealCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3 shrink-0"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ScoreBar({
  score,
  max = 4,
  variant = "teal",
}: {
  score: number;
  max?: number;
  variant?: "teal" | "purple";
}) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="report-score-bar">
      <div
        className={
          variant === "purple" ? "report-score-bar-fill-purple" : "report-score-bar-fill-teal"
        }
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Watermark() {
  return (
    <div className="report-watermark" aria-hidden>
      <div className="report-watermark-inner">
        <p>PRIVATE</p>
        <p>For private use only. Not a credential, certification, or hiring record.</p>
      </div>
    </div>
  );
}

function PrivateFooter() {
  return (
    <p className="report-private-footer">
      For private use only. Not a credential, certification, or hiring record.
    </p>
  );
}

export function CandidateResultsSummary({ report }: { report: ParticipantReport }) {
  return (
    <article className="report-document print-area mx-auto max-w-4xl overflow-hidden rounded-xl border border-[var(--report-border)] bg-white shadow-soft">
      {/* Section 1 — Cover */}
      <section className="report-section relative flex min-h-[780px] flex-col">
        <div className="report-header-bar">
          <Logo height={36} />
        </div>
        <Watermark />
        <div className="report-section-inner flex flex-1 flex-col px-8 py-8 sm:px-12 sm:py-10">
          <h1 className="text-[1.65rem] font-bold tracking-tight text-[var(--report-text)] sm:text-[1.875rem]">
            Candidate Results Summary
          </h1>

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-lg font-semibold text-[var(--report-text)]">{report.candidateName}</p>
            <p className="text-sm text-[var(--report-muted)]">{report.reportDate}</p>
          </div>

          <hr className="report-divider" />

          <p className="report-eyebrow">Performance Scenario</p>
          <p className="mt-2 text-base font-semibold text-[var(--report-text)]">
            {report.scenarioTitle}
          </p>

          <hr className="report-divider" />

          <div className="flex flex-wrap gap-3">
            {report.humanReviewed && (
              <span className="report-trust-badge">
                <TealCheckIcon />
                Human-Reviewed
              </span>
            )}
            {report.evidenceBased && (
              <span className="report-trust-badge">
                <TealCheckIcon />
                Evidence-Based
              </span>
            )}
            {report.consistencyChecked && (
              <span className="report-trust-badge">
                <TealCheckIcon />
                Consistency Checked
              </span>
            )}
          </div>

          <div className="mt-10">
            <h2 className="text-base font-bold text-[var(--report-text)]">
              Skills Required to Meet Standard
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {report.skillsRequired.map((skill) => (
                <span key={skill} className="report-skill-pill">
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--report-muted)]">
              Defined by the project brief. Reflects the capabilities evaluated in this project.
            </p>
          </div>

          {report.isVerified && (
            <>
              <hr className="report-divider" />
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="report-verified-pill">Verified</span>
                <p className="text-sm leading-relaxed text-[var(--report-text-secondary)]">
                  {report.verificationMessage}
                </p>
              </div>
            </>
          )}

          <PrivateFooter />
        </div>
      </section>

      {/* Section 2 — Composite Score */}
      <section className="report-section relative flex min-h-[780px] flex-col border-t border-[var(--report-border)]">
        <Watermark />
        <div className="report-section-inner flex flex-1 flex-col px-8 py-8 sm:px-12 sm:py-10">
          <div className="report-card p-6 sm:p-8">
            <p className="report-eyebrow">Composite Score</p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="report-composite-score">
                {report.compositeScore.toFixed(2)}
                <span className="report-composite-denom">/ 4.0</span>
              </p>
              {report.isVerified && (
                <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--report-muted)]">
                  Verified {report.compositeScore.toFixed(2)}
                </span>
              )}
            </div>
            <div className="relative mt-6">
              <ScoreBar score={report.compositeScore} variant="purple" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {report.capabilities.map((cap) => (
              <div key={cap.name} className="report-capability-card">
                <p className="report-eyebrow">{cap.name}</p>
                <p className="report-capability-score mt-2">{cap.score.toFixed(2)}</p>
                <div className="mt-3">
                  <ScoreBar score={cap.score} />
                </div>
              </div>
            ))}
          </div>

          <div className="report-accent-box-orange mt-8">
            <p className="text-sm font-bold text-[var(--report-text)]">
              Strongest Verified Signals {report.strongestSignal}
            </p>
          </div>

          <div className="report-accent-box-purple mt-6">
            <h2 className="text-sm font-bold text-[var(--report-text)]">What This Result Confirms</h2>
            <div className="mt-3 space-y-3">
              {report.resultConfirmation.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-[var(--report-text-secondary)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <PrivateFooter />
        </div>
      </section>

      {/* Section 3 — Evaluation Breakdown */}
      <section className="report-section relative flex min-h-[780px] flex-col border-t border-[var(--report-border)]">
        <Watermark />
        <div className="report-section-inner flex flex-1 flex-col px-8 py-8 sm:px-12 sm:py-10">
          <h2 className="text-xl font-bold text-[var(--report-text)]">Evaluation Breakdown</h2>
          <div className="mt-8 space-y-8">
            {report.capabilities.map((cap) => (
              <div key={cap.name} className="border-b border-[var(--report-border)] pb-8 last:border-0">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="min-w-[7rem] text-sm font-semibold text-[var(--report-text)]">
                    {cap.name}
                  </h3>
                  <div className="min-w-0 flex-1">
                    <ScoreBar score={cap.score} />
                  </div>
                  <span className="text-sm font-bold tabular-nums text-[var(--report-teal-dark)]">
                    {cap.score.toFixed(2)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--report-text-secondary)]">
                  {cap.breakdown}
                </p>
              </div>
            ))}
          </div>
          <PrivateFooter />
        </div>
      </section>

      {/* Section 4 — Reviewer Feedback */}
      <section className="report-section relative flex min-h-[780px] flex-col border-t border-[var(--report-border)]">
        <Watermark />
        <div className="report-section-inner flex flex-1 flex-col px-8 py-8 sm:px-12 sm:py-10">
          <h2 className="text-xl font-bold text-[var(--report-text)]">Reviewer Feedback</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--report-text)]">Reviewer feedback</p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--report-text-secondary)]">
            {report.reviewerFeedback}
          </p>

          <h2 className="mt-10 text-xl font-bold text-[var(--report-text)]">
            Potential Areas for Growth
          </h2>
          <ol className="mt-6 space-y-4">
            {report.growthAreas.map((area, i) => (
              <li key={area.title} className="report-growth-card">
                <span className="report-growth-num">{i + 1}</span>
                <div>
                  <h3 className="text-sm font-bold text-[var(--report-text)]">{area.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--report-text-secondary)]">
                    {area.description}
                  </p>
                  {area.effort && (
                    <p className="mt-2 text-sm text-[var(--report-text-secondary)]">
                      Effort: {area.effort}.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <PrivateFooter />
        </div>
      </section>

      {/* Section 5 — Candidate Perspective */}
      <section className="report-section relative flex min-h-[780px] flex-col border-t border-[var(--report-border)]">
        <Watermark />
        <div className="report-section-inner flex flex-1 flex-col px-8 py-8 sm:px-12 sm:py-10">
          <h2 className="text-xl font-bold text-[var(--report-text)]">
            Verified Candidate Perspective
          </h2>
          <div className="report-quote-box mt-6">
            {report.candidateQuotes.map((quote, i) => (
              <blockquote key={i}>&ldquo;{quote}&rdquo;</blockquote>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--report-muted)]">
            Candidate-authored content is presented verbatim and does not override the platform
            evaluation.
          </p>

          <h2 className="mt-10 text-xl font-bold text-[var(--report-text)]">How You Can Use This</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="report-usage-card">
              <p className="text-sm font-bold text-[var(--report-text)]">→ Interviews</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--report-text-secondary)]">
                {report.usageInterviews}
              </p>
            </div>
            <div className="report-usage-card">
              <p className="text-sm font-bold text-[var(--report-text)]">→ Portfolio</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--report-text-secondary)]">
                {report.usagePortfolio}
              </p>
            </div>
          </div>
          <PrivateFooter />
        </div>
      </section>

      {/* Section 6 — Footer */}
      <section className="report-section relative border-t border-[var(--report-border)]">
        <Watermark />
        <div className="report-section-inner px-8 py-8 sm:px-12 sm:py-10">
          <div className="report-disclaimer-bar">
            <p>
              This summary reflects evaluated work from a specific project only. It is not a hiring
              recommendation, certification, or prediction of future performance.
            </p>
            <p className="report-eyebrow mt-4">SignalVerified</p>
          </div>
          <div className="mt-8 flex justify-end">
            <Logo height={28} />
          </div>
          <PrivateFooter />
        </div>
      </section>
    </article>
  );
}
