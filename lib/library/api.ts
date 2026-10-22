import { ApiError, apiFetch } from "@/lib/api";
import { clearSession, getToken } from "@/lib/auth";
import type { ApiEnvelope } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.signalverified.net";
const BASE = "/employer/v1/project/management";

export type BriefDocument = {
  id: string;
  doc_name: string;
  file_url: string;
};

export type LibraryRow = {
  team_id: string;
  student_id: string;
  student_name: string;
  project_id: string;
  project_brief_title: string;
  project_brief_summary: string;
  brief_documents: BriefDocument[];
  has_project_zip: boolean;
  project_zip_name: string | null;
};

export type InstructionDocument = {
  id: string;
  doc_name: string;
  file: string;
};

export type TeamProjectZip = {
  id: string;
  team_name: string;
  project_zip_file: string;
};

export type ZipMemberFile = {
  name: string;
  path: string;
  size_bytes: number;
  mime_type?: string;
  content_type?: string;
  preview_url: string;
};

export type ZipContents = {
  team_id: string;
  zip_name: string;
  files: ZipMemberFile[];
};

/** GET .../library/?search= */
export async function getLibrary(search = "") {
  const q = new URLSearchParams();
  if (search.trim()) q.set("search", search.trim());
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return apiFetch<ApiEnvelope<LibraryRow[]>>(`${BASE}/library/${suffix}`);
}

/** GET .../instruction_documents/?project_id= */
export async function getInstructionDocuments(projectId: string) {
  return apiFetch<ApiEnvelope<InstructionDocument[]>>(
    `${BASE}/instruction_documents/?project_id=${encodeURIComponent(projectId)}`,
  );
}

/** GET .../team_project_zip/?team_id= */
export async function getTeamProjectZip(teamId: string) {
  return apiFetch<ApiEnvelope<TeamProjectZip>>(
    `${BASE}/team_project_zip/?team_id=${encodeURIComponent(teamId)}`,
  );
}

/** GET .../team_zip_contents/?team_id= */
export async function getTeamZipContents(teamId: string) {
  return apiFetch<ApiEnvelope<ZipContents>>(
    `${BASE}/team_zip_contents/?team_id=${encodeURIComponent(teamId)}`,
  );
}

/**
 * Auth-aware zip member fetch → blob + object URL.
 * preview_url may be relative (/employer/v1/...) or absolute.
 */
export async function openZipMember(previewUrl: string) {
  if (!previewUrl) throw new ApiError("Missing preview URL", 400);

  const token = getToken();
  if (!token) throw new ApiError("Not authenticated", 401);

  let requestUrl = previewUrl;
  if (previewUrl.startsWith("http")) {
    try {
      const parsed = new URL(previewUrl);
      const api = new URL(API_URL);
      if (parsed.origin === api.origin) {
        requestUrl = `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      // keep full url
    }
  }

  const absolute =
    requestUrl.startsWith("http") ? requestUrl : `${API_URL}${requestUrl}`;

  const res = await fetch(absolute, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    clearSession();
    throw new ApiError("Unauthorized", 401);
  }

  const contentType =
    res.headers.get("content-type") || "application/octet-stream";
  let blob = await res.blob();

  if (contentType.includes("application/json")) {
    const text = await blob.text();
    let parsed: { status?: boolean; message?: string } | null = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    if (parsed && parsed.status === false) {
      throw new ApiError(parsed.message || "Failed to open file", res.status || 400);
    }
    if (!res.ok) {
      throw new ApiError(parsed?.message || `Request failed (${res.status})`, res.status);
    }
    blob = new Blob([text], { type: contentType });
  } else if (!res.ok) {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }

  const objectUrl = URL.createObjectURL(blob);
  return { blob, objectUrl, contentType };
}

export function libraryErrorMessage(err: unknown, fallback = "Something went wrong") {
  if (err instanceof ApiError) {
    if (err.status === 403) return err.message || "Not assigned";
    if (err.status === 404) return err.message || "Zip / file missing";
    if (err.status === 400) return err.message || "Bad path";
    return err.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
