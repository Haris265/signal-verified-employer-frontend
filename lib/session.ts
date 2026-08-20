import { login as loginRequest } from "./api";
import { setSession } from "./auth";
import { EMPLOYER_ROLE, type AuthUser } from "./types";

type LoginResponse = {
  status: boolean;
  message: string;
  access_token?: string;
  data?: AuthUser;
};

export async function loginEmployer(email: string, password: string) {
  const json = (await loginRequest(email, password)).raw as LoginResponse;
  const token = json.access_token;
  const user = json.data;

  if (!token || !user) {
    throw new Error(json.message || "Login failed");
  }
  if (user.role !== EMPLOYER_ROLE) {
    throw new Error("This portal is for employer accounts only.");
  }

  setSession(token, user);
  return user;
}
