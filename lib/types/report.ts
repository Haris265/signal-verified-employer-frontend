export type ReportCapability = {
  name: string;
  score: number;
  breakdown: string;
};

export type ReportGrowthArea = {
  title: string;
  description: string;
  effort: string;
};

export type ParticipantReport = {
  candidateName: string;
  reportDate: string;
  scenarioTitle: string;
  projectName: string;
  humanReviewed: boolean;
  evidenceBased: boolean;
  consistencyChecked: boolean;
  skillsRequired: string[];
  isVerified: boolean;
  verificationMessage: string;
  compositeScore: number;
  capabilities: ReportCapability[];
  strongestSignal: string;
  resultConfirmation: string[];
  reviewerFeedback: string;
  growthAreas: ReportGrowthArea[];
  candidateQuotes: string[];
  usageInterviews: string;
  usagePortfolio: string;
  the_signal_url: string | null;
};
