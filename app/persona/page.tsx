"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { setPersona, type Persona } from "@/lib/auth";

const ORG_MAIL =
  "mailto:questions@signalverified.net?subject=Organization%20account%20request&body=Hello%2C%0A%0AI%20represent%20an%20organization%20and%20would%20like%20an%20employer%20account%20on%20SignalVerified.%0A%0AOrganization%3A%20%0AName%3A%20%0AEmail%3A%20%0A";

function ArrowLeftIcon() {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
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

function GraduationCapIcon() {
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
      className="h-7 w-7"
      aria-hidden
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

function BuildingIcon() {
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
      className="h-7 w-7"
      aria-hidden
    >
      <path d="M10 12h4" />
      <path d="M10 8h4" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

export default function PersonaPage() {
  const router = useRouter();

  function choose(persona: Persona) {
    setPersona(persona);
    if (persona === "organization") {
      window.location.href = ORG_MAIL;
      return;
    }
    router.push("/register");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Logo height={40} className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded text-[13px] text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeftIcon />
              Back
            </Link>
            <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-6 rounded-full bg-primary" />
                <span className="h-1.5 w-6 rounded-full bg-primary" />
              </span>
              Step 2 of 2
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
            Welcome to SignalVerified
          </p>
          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground lg:text-[3rem]">
            How will you use SignalVerified?
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
            Pick the path that fits you. You can change this later — it just shapes what you see
            first.
          </p>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Not sure? Choose <span className="text-foreground">Student / Candidate</span> if
            you&apos;ll be completing the work, and{" "}
            <span className="text-foreground">Organization</span> if you&apos;ll be reviewing it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <button
            type="button"
            onClick={() => choose("candidate")}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 lg:p-10"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand" />
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <GraduationCapIcon />
            </span>
            <span className="mt-7 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Student / Candidate
            </span>
            <span className="mt-3 text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
              Prove what you can do
            </span>
            <span className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Complete a role-aligned project, get it evaluated against a consistent standard, and
              own the record it produces.
            </span>
            <ul className="mt-7 space-y-2 text-[13.5px] text-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Start a project
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Track progress
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Control what is shared
              </li>
            </ul>
            <span className="mt-9 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition group-hover:bg-primary/90">
              Continue as student or candidate
              <ArrowRightIcon />
            </span>
          </button>

          <button
            type="button"
            onClick={() => choose("organization")}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 lg:p-10"
          >
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-signal" />
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-signal-tint text-signal-foreground">
              <BuildingIcon />
            </span>
            <span className="mt-7 text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Organization
            </span>
            <span className="mt-3 text-[1.9rem] font-semibold leading-tight tracking-[-0.02em] text-foreground">
              See evidence, not promises
            </span>
            <span className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Launch projects for your roles or programs and review human-governed, AI-assisted
              evidence of real work.
            </span>
            <ul className="mt-7 space-y-2 text-[13.5px] text-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Launch a project
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Review outcomes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Download summaries
              </li>
            </ul>
            <span className="mt-9 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition group-hover:bg-primary/90">
              Continue as an organization
              <ArrowRightIcon />
            </span>
          </button>
        </div>
      </main>

      <footer className="mt-24 border-t border-border/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo height={40} className="h-10 w-auto object-contain" />
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              SignalVerified produces decision-grade evidence of demonstrated capability through a
              human-governed, AI-assisted process, scored against the published 4.0 rubric. We do
              not rank, rate, or compare candidates against one another, and our reports are not
              intended to be the sole basis for an employment decision.
            </p>
          </div>
          <div className="text-[13px] text-muted-foreground">
            <div className="font-medium text-foreground">Questions?</div>
            <p className="mt-2">
              Email{" "}
              <a
                href="mailto:customersupport@signalverified.net"
                className="text-primary underline-offset-4 hover:underline"
              >
                customersupport@signalverified.net
              </a>{" "}
              and a member of the SignalVerified team will follow up within one business day.
            </p>
            <p className="mt-4">
              <a
                href="https://www.signalverified.net"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-foreground"
              >
                www.signalverified.net
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-border/70">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} SignalVerified. All rights reserved.</span>
            <span>Prototype environment · Mock data only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
