import type { AuthUser } from "./types";
import { EMPLOYER_ROLE } from "./types";

const TOKEN_KEY = "sv_employer_token";
const USER_KEY = "sv_employer_user";
const PERSONA_KEY = "sv_persona";

export type Persona = "organization" | "candidate";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getPersona(): Persona | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(PERSONA_KEY);
  if (value === "organization" || value === "candidate") return value;
  return null;
}

export function setPersona(persona: Persona) {
  localStorage.setItem(PERSONA_KEY, persona);
}

export function clearPersona() {
  localStorage.removeItem(PERSONA_KEY);
}

export function isEmployer(user: AuthUser | null): boolean {
  return !!user && user.role === EMPLOYER_ROLE;
}

export function displayName(user: AuthUser | null): string {
  if (!user) return "";
  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return name || user.email;
}
