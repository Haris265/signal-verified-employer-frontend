import type { Entitlement } from "./types";

/**
 * Admin-controlled license gate.
 * When contact_sales is true, the org is not a contractual partner —
 * New project CTAs should be greyed out.
 */
export function canRequestNewProject(entitlement: Entitlement | null | undefined): boolean {
  if (!entitlement) return false;
  return !entitlement.contact_sales;
}

export const HIRING_FINALIST_MIN = 1;
export const HIRING_FINALIST_MAX = 3;
export const PROGRAM_PARTICIPANT_MIN = 1;
export const PROGRAM_PARTICIPANT_MAX = 50;
export const PROGRAM_PARTICIPANT_DEFAULT = 15;

export function finalistBounds(engagementType: 1 | 2) {
  if (engagementType === 1) {
    return { min: HIRING_FINALIST_MIN, max: HIRING_FINALIST_MAX, defaultCount: 3 };
  }
  return {
    min: PROGRAM_PARTICIPANT_MIN,
    max: PROGRAM_PARTICIPANT_MAX,
    defaultCount: PROGRAM_PARTICIPANT_DEFAULT,
  };
}

export function clampFinalistCount(engagementType: 1 | 2, count: number) {
  const { min, max } = finalistBounds(engagementType);
  if (!Number.isFinite(count)) return min;
  return Math.min(max, Math.max(min, Math.round(count)));
}
