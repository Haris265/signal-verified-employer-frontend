"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getToken, getUser, isEmployer } from "@/lib/auth";
import { loginEmployer } from "@/lib/session";
import { ApiError } from "@/lib/api";

const CONTACT_MAIL = "mailto:questions@signalverified.net";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
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

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("loreal.ta@test.com");
  const [password, setPassword] = useState("TestPass123!");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken() && isEmployer(getUser())) {
      router.replace("/projects");
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginEmployer(email.trim(), password);
      router.replace("/projects");
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-tint px-8 py-10 lg:flex lg:px-12 lg:py-12">
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
          <Logo height={56} className="h-14 w-auto" />
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
          <span>
            Not a member?{" "}
            <Link
              href="/persona"
              className="rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Sign up now
            </Link>
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[420px] py-10">
            <div className="mb-8 lg:hidden">
              <div className="inline-flex rounded-xl border border-brand-soft/40 bg-card px-4 py-3 shadow-sm">
                <Logo height={48} className="h-12 w-auto" />
              </div>
            </div>

            <h1 className="text-[26px] font-semibold tracking-tight text-foreground">
              Sign in to SignalVerified
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start a project or pick up where you left off.
            </p>

            <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="email" className="text-[12.5px] font-medium text-foreground">
                  Email address
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@company.com"
                    required
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
                  <a
                    href="mailto:questions@signalverified.net?subject=Password%20help"
                    className="text-[12.5px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background px-3.5 pr-11 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <EyeIcon open={!showPassword} />
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-[12.5px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-[var(--primary)]"
                />
                Keep me signed in on this device
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-70"
              >
                {loading ? "Signing in…" : "Sign in"}
                {!loading && (
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                or
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Link
              href="/persona"
              className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left transition hover:border-input hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <span>
                <span className="block text-[13.5px] font-medium text-foreground">
                  First time here?
                </span>
                <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                  Create an account and choose how you&apos;ll use SignalVerified.
                </span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>

            <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheckIcon />
              <span>
                Prototype environment · Demo credentials are pre-filled · Questions?{" "}
                <a
                  href={CONTACT_MAIL}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  customersupport@signalverified.net
                </a>
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
