import { getToken, clearSession } from "./auth";
import type { ApiEnvelope, AuthUser, Entitlement, ParticipantDetail, ParticipantRow, ProjectCard, ProjectDetail } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers || {});
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isForm && !headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getToken();
    if (!token) {
      throw new ApiError("Not authenticated", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await parseJson(res);

  if (res.status === 401) {
    clearSession();
    throw new ApiError(json?.message || "Unauthorized", 401);
  }

  if (!res.ok) {
    throw new ApiError(json?.message || `Request failed (${res.status})`, res.status);
  }

  if (json && typeof json.status === "boolean" && json.status === false) {
    throw new ApiError(json.message || "Request failed", res.status);
  }

  return json as T;
}

export async function login(email: string, password: string) {
  const json = await apiFetch<{
    status: boolean;
    message: string;
    access_token?: string;
    data?: AuthUser;
  }>(
    "/authentication/v1/user/login/",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );

  return { message: json.message, raw: json };
}

/** B2C candidate self-registration. Falls back to mailto if endpoint is unavailable. */
export async function registerCandidate(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  return apiFetch<ApiEnvelope<{ id?: string }>>(
    "/authentication/v1/user/register/",
    {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        role: "candidate",
        persona: "candidate",
      }),
    },
    false,
  );
}

export async function getEntitlement() {
  return apiFetch<
    ApiEnvelope<{
      organizations: Entitlement[];
      primary: Entitlement | null;
    }>
  >("/employer/v1/entitlement/");
}

export async function getProjects() {
  return apiFetch<
    ApiEnvelope<{
      summary: {
        project_count: number;
        participant_count: number;
        complete_count: number;
        summary_line: string;
      };
      projects: ProjectCard[];
    }>
  >("/employer/v1/project/management/project_view/");
}

export async function getProjectDetail(projectId: string) {
  return apiFetch<ApiEnvelope<ProjectDetail>>(
    `/employer/v1/project/management/project_detail/?project_id=${encodeURIComponent(projectId)}`,
  );
}

export async function getParticipants(projectId: string, search = "") {
  const q = new URLSearchParams({ project_id: projectId });
  if (search) q.set("search", search);
  return apiFetch<
    ApiEnvelope<{
      table_label: string;
      participants: ParticipantRow[];
    }>
  >(`/employer/v1/project/management/participants/?${q.toString()}`);
}

export async function getParticipantDetail(assignmentId: string) {
  return apiFetch<ApiEnvelope<ParticipantDetail>>(
    `/employer/v1/participant/management/participant_detail/?assignment_id=${encodeURIComponent(assignmentId)}`,
  );
}

export async function requestProject(payload: {
  engagement_type: number;
  requested_role_name: string;
  requested_jd_text?: string;
  requested_jd_file?: File | null;
  requested_finalist_count: number;
  target_completion_date: string;
  notes_to_ops?: string;
}) {
  type RequestResult = ApiEnvelope<{
    id: string;
    name: string;
    status: string;
    awaiting_scoping: boolean;
    view_enabled: boolean;
  }>;

  if (payload.requested_jd_file) {
    const form = new FormData();
    form.append("engagement_type", String(payload.engagement_type));
    form.append("requested_role_name", payload.requested_role_name);
    if (payload.requested_jd_text) form.append("requested_jd_text", payload.requested_jd_text);
    form.append("requested_jd_file", payload.requested_jd_file);
    form.append("requested_finalist_count", String(payload.requested_finalist_count));
    form.append("target_completion_date", payload.target_completion_date);
    if (payload.notes_to_ops) form.append("notes_to_ops", payload.notes_to_ops);
    return apiFetch<RequestResult>("/employer/v1/project/management/project_request/", {
      method: "POST",
      body: form,
    });
  }

  return apiFetch<RequestResult>("/employer/v1/project/management/project_request/", {
    method: "POST",
    body: JSON.stringify({
      engagement_type: payload.engagement_type,
      requested_role_name: payload.requested_role_name,
      requested_jd_text: payload.requested_jd_text || "",
      requested_finalist_count: payload.requested_finalist_count,
      target_completion_date: payload.target_completion_date,
      notes_to_ops: payload.notes_to_ops || "",
    }),
  });
}
