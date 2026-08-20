export const EMPLOYER_ROLE = 3;

export type AuthUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: number;
  image?: string | null;
  is_active?: boolean;
};

export type Entitlement = {
  id: string;
  name: string;
  plan_type: string | null;
  plan_expires: string | null;
  projects_included: number | null;
  projects_used: number;
  projects_remaining: number | null;
  is_subscription: boolean;
  contact_sales: boolean;
  display_text: string;
};

export type ProjectCard = {
  id: string;
  name: string;
  engagement_type: string;
  partner_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  awaiting_scoping: boolean;
  view_enabled: boolean;
  participant_count: number;
  status_counts: Record<string, number>;
};

export type ProjectDetail = {
  id: string;
  name: string;
  engagement_type: string;
  status: string;
  partner_name: string | null;
  start_date: string | null;
  end_date: string | null;
  table_label: string;
  progress: {
    participants: number;
    complete: number;
    percent: number;
  };
  metrics: {
    participants: number;
    complete: number;
    verified_or_meets: number;
    verified_or_meets_label: string;
    in_review: number;
  };
  insights: {
    capability_scores: Array<{
      capability: string;
      score: number | null;
      label: string | null;
    }>;
    strongest_capability: string | null;
    development_opportunity: string | null;
    overall_observation: string | null;
  };
};

export type ParticipantRow = {
  id: string;
  name: string;
  status: string;
  result: string | null;
  overall_score: number | null;
};

export type ParticipantDetail = {
  id: string;
  name: string;
  role: string;
  project: {
    id: string;
    name: string;
    engagement_type: string;
  };
  designation: string | null;
  overall_score: number | null;
  evidence_summary: string;
  capabilities: Array<{
    capability: string;
    score: number | null;
    label: string | null;
  }>;
  strengths: string[];
  watch_areas: string[];
  the_signal_url: string | null;
};

export type ApiEnvelope<T> = {
  status: boolean;
  message: string;
  data?: T;
};
