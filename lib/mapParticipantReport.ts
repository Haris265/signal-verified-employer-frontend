import { mockParticipantReport } from "./mockParticipantReport";
import type { ParticipantDetail } from "./types";
import type { ParticipantReport } from "./types/report";

/** Flip to false when the full report API is available. */
export const USE_MOCK_REPORT = true;

export function mapParticipantToReport(detail: ParticipantDetail): ParticipantReport {
  const base = USE_MOCK_REPORT ? mockParticipantReport : { ...mockParticipantReport };

  const capabilities =
    detail.capabilities?.length > 0
      ? detail.capabilities.map((cap) => ({
          name: cap.capability,
          score: cap.score ?? 0,
          breakdown: cap.label || "No breakdown available yet.",
        }))
      : base.capabilities;

  const growthAreas =
    detail.watch_areas?.length > 0
      ? detail.watch_areas.map((area) => ({
          title: area,
          description: "",
          effort: "Moderate",
        }))
      : base.growthAreas;

  return {
    ...base,
    candidateName: detail.name || base.candidateName,
    projectName: detail.project.name || base.projectName,
    scenarioTitle: detail.project.name || base.scenarioTitle,
    compositeScore: detail.overall_score ?? base.compositeScore,
    capabilities,
    strongestSignal: detail.strengths?.[0] || base.strongestSignal,
    resultConfirmation: detail.evidence_summary
      ? [detail.evidence_summary]
      : base.resultConfirmation,
    reviewerFeedback: detail.evidence_summary || base.reviewerFeedback,
    growthAreas,
    isVerified: detail.designation?.toLowerCase() === "verified" || base.isVerified,
    the_signal_url: detail.the_signal_url,
    ...(USE_MOCK_REPORT
      ? {
          candidateName: detail.name || base.candidateName,
          projectName: detail.project.name || base.projectName,
          scenarioTitle: detail.project.name || base.scenarioTitle,
          the_signal_url: detail.the_signal_url,
        }
      : {}),
  };
}
