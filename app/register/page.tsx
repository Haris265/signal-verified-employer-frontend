"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getPersona, setPersona } from "@/lib/auth";
import { registerCandidate, ApiError } from "@/lib/api";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.338-5.08" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 transition group-hover:translate-x-0.5"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-3.5 w-3.5 shrink-0"
      aria-hidden
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-2.5 w-2.5"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function splitFullName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);

  useEffect(() => {
    if (!getPersona()) setPersona("candidate");
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!hasMinLength || !hasNumber) {
      setError("Password must be at least 8 characters and include one number.");
      return;
    }

    const { first_name, last_name } = splitFullName(fullName);
    if (!first_name) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerCandidate({
        first_name,
        last_name: last_name || first_name,
        email: email.trim(),
        password,
      });
      setSuccess(
        res.message ||
          "Account created. You can sign in once your access is confirmed."
      );
      setTimeout(() => router.push("/"), 1800);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        const subject = encodeURIComponent("Candidate account request");
        const body = encodeURIComponent(
          `Hello,\n\nI would like to create a candidate account on SignalVerified.\n\nName: ${fullName.trim()}\nEmail: ${email.trim()}\n\nThank you.`
        );
        window.location.href = `mailto:questions@signalverified.net?subject=${subject}&body=${body}`;
        return;
      }
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-tint px-8 py-10 lg:px-12 lg:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-28 h-[24rem] w-[24rem] rounded-full border border-brand-soft/50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full border border-signal/35"
        />

        <Link
          href="/"
          className="relative inline-flex w-fit items-center rounded-xl border border-brand-soft/40 bg-card px-4 py-3 shadow-sm"
        >
          <Logo height={56} className="h-14 w-auto object-contain" />
        </Link>

        <div className="relative mt-12 max-w-md lg:mt-0">
          <h2 className="text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground lg:text-[2.5rem]">
            Evidence from real work,
            <br />
            <span className="text-brand">in one place.</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Participants complete role-aligned projects, reviewers evaluate the work against a
            consistent standard, and organizations see the evidence that results.
          </p>
        </div>

        <p className="relative mt-12 flex items-center gap-2 text-xs text-muted-foreground lg:mt-0">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-signal-tint text-signal-foreground">
            <LockIcon />
          </span>
          Consent-based · The participant owns the record
        </p>
      </aside>

      <main className="relative flex min-h-screen flex-col px-6 py-8 lg:px-16">
        <div className="flex justify-end text-[13px] text-muted-foreground">
          <span className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-6 rounded-full bg-primary" />
                <span className="h-1.5 w-6 rounded-full bg-primary" />
              </span>
              Step 2 of 2
            </span>
            <span className="hidden sm:inline">
              Already a member?{" "}
              <Link
                href="/"
                className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Sign in
              </Link>
            </span>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[420px] py-10">
            <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              You&apos;re signing up as a student or candidate.
            </p>

            <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="full_name" className="text-[12.5px] font-medium text-foreground">
                    Full name
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="full_name"
                    autoComplete="name"
                    autoFocus
                    required
                    placeholder="Maya Johnson"
                    className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="text-[12.5px] font-medium text-foreground">
                    Email address
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[12.5px] font-medium text-foreground">
                    Password
                  </label>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    className="h-11 w-full rounded-lg border border-input bg-background px-3.5 pr-11 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <EyeIcon open={!showPassword} />
                  </button>
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 pt-0.5">
                <li className="flex items-center gap-1.5 text-[12px] text-foreground">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                      hasMinLength
                        ? "border-transparent bg-signal text-signal-foreground"
                        : "border-border bg-transparent text-transparent"
                    }`}
                  >
                    <CheckIcon />
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center gap-1.5 text-[12px] text-foreground">
                  <span
                    className={`inline-flex h-4 w-4 items-center justify-center rounded-full border ${
                      hasNumber
                        ? "border-transparent bg-signal text-signal-foreground"
                        : "border-border bg-transparent text-transparent"
                    }`}
                  >
                    <CheckIcon />
                  </span>
                  One number
                </li>
              </ul>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-70"
              >
                {loading ? "Creating account…" : "Continue"}
                {!loading && <ArrowRightIcon />}
              </button>

              <p className="text-center text-[12px] text-muted-foreground sm:hidden">
                Already a member?{" "}
                <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </form>

            <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheckIcon />
              <span>
                Prototype environment · Mock data only · Questions?{" "}
                <a
                  href="mailto:questions@signalverified.net"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  questions@signalverified.net
                </a>
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
