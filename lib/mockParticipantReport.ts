import type { ParticipantReport } from "./types/report";

export const mockParticipantReport: ParticipantReport = {
  candidateName: "Alex Taylor May",
  reportDate: "August 12, 2026",
  scenarioTitle: "Get Verified: Cohort 2",
  projectName: "Get Verified: Cohort 2",
  humanReviewed: true,
  evidenceBased: true,
  consistencyChecked: true,
  skillsRequired: [
    "Data Analysis",
    "Business Strategy",
    "Strategic Prioritization",
    "Executive Communication",
    "Risk Assessment",
  ],
  isVerified: true,
  verificationMessage: "Your work met the SignalVerified standard for this work scenario.",
  compositeScore: 3.6,
  capabilities: [
    {
      name: "Relevance",
      score: 3.5,
      breakdown:
        'The decision was stated clearly, both alternatives were defended against with specific reasoning (Automotive as strain-from-growth whose risk is "ahead of us" versus Mobile\'s damage "compounding now," IoT as the loudest signal on the least trustworthy data), and uncertainty was tied to the choice with named flip conditions.',
    },
    {
      name: "Mastery",
      score: 3.75,
      breakdown:
        "A bounded action plan was delivered with named owners and numeric triggers, providing decision-grade specifics beyond a concrete, bounded recommendation.",
    },
    {
      name: "Communication",
      score: 3.5,
      breakdown:
        "Methods used were simple pivots, appropriately matched to 124 records, and were AI-assisted in execution.",
    },
    {
      name: "Collaboration",
      score: 4.0,
      breakdown:
        "The work was broadly integrated rather than reliant on a single dependency. Every recommendation carried a named owner and role, and the gating logic was explicit across all three recommendations, with each input's effect on the next step stated.",
    },
  ],
  strongestSignal: "Collaboration",
  resultConfirmation: [
    "Reviewers observed a bounded action plan with named owners and numeric triggers assigned to specific roles. These specifics went beyond a concrete, bounded recommendation into decision-grade detail.",
    "This result confirms an ability to translate analysis into structured, actionable direction that leadership can immediately discuss, resource, or monitor. In a workplace setting, this kind of output reduces the distance between insight and execution, giving stakeholders clear ownership lines and defined conditions under which decisions should change.",
  ],
  reviewerFeedback:
    "Reviewers observed a clearly stated decision, defended against specific alternatives, with uncertainty tied to named flip conditions. Ownership of the process was noted as exceptional and unusually transparent. Recommendations carried named owners and roles, with explicit gating logic across all three. Analytical methods were simple pivots appropriate to the dataset size and were AI-assisted in execution.",
  growthAreas: [
    {
      title: "Mastery: Volume Weighted Analysis",
      description:
        "The candidate noted that volume-weighting the margin analysis would allow the recommendation's dollar impact to be sized rather than only directional, addressing what they identified as the single biggest limitation on the recommendation.",
      effort: "Moderate",
    },
    {
      title: "Mastery: Deeper Signal Decomposition",
      description:
        "Reviewer-supported evidence indicated methods relied on simple pivots. Adding price-versus-cost splits by process node, escalation severity rather than raw counts, and contract-level detail would test whether the margin decline is concentrated in a few renegotiations — the finding most likely to shift the structural reading.",
      effort: "Moderate",
    },
  ],
  candidateQuotes: [
    "Ranking by signal quality rather than signal volume. Automotive was the loudest alarm — escalations up 5.9× and on-time delivery down 15 points — and IoT had the largest raw defect numbers in the portfolio. But Automotive's margins held at ~46% with auto-grade defects, which made it growth strain rather than deterioration, and IoT's defect data sat on coverage too thin to act against. Mobile was the only line whose economics were eroding, on the data I trusted most.",
    "This was an individual project and I owned it end to end: framing the decision question, writing down my hypothesis before touching the data, defining the four tests I would rank signals against, building every pivot, making the ranking call, and producing all three artifacts — the executive memo, the visual summary deck, and the trace file documenting my reasoning.",
    "I re-derived every figure that appears in any deliverable against the pivot tables in my trace file, and the headline numbers are live formulas over the raw data so they recompute rather than sitting as hardcoded text. Every prompt I gave is logged in the Prompts Log tab of the trace file.",
  ],
  usageInterviews:
    "In interviews, reference the Get Verified: Cohort 2 project to illustrate how you translated mixed signals into a bounded recommendation with named owners and numeric triggers, showing how you make prioritization calls under uncertainty.",
  usagePortfolio:
    "In a portfolio, include the executive memo, visual summary, and trace file from Get Verified: Cohort 2 to demonstrate decision-grade recommendations with explicit gating logic and transparent reasoning.",
  the_signal_url: null,
};
