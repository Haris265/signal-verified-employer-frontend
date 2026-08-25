"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { setPersona, type Persona } from "@/lib/auth";

const ORG_MAIL =
  "mailto:questions@signalverified.net?subject=Organization%20account%20request&body=Hello%2C%0A%0AI%20represent%20an%20organization%20and%20would%20like%20an%20employer%20account%20on%20SignalVerified.%0A%0AOrganization%3A%20%0AName%3A%20%0AEmail%3A%20%0A";

function BuildingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-primary"
      aria-hidden
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-primary"
      aria-hidden
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-muted-foreground"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
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
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex w-full max-w-lg flex-col">
        <Link href="/" className="inline-flex w-fit rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <Logo height={48} className="h-12 w-auto" />
        </Link>

        <h1 className="mt-10 text-[26px] font-semibold tracking-tight text-foreground">
          How will you use SignalVerified?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          First-time users select a persona. Organizations are provisioned by our team (B2B).
          Students and candidates can create their own account (B2C).
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => choose("organization")}
            className="flex w-full items-start gap-4 rounded-xl border border-border bg-card px-4 py-4 text-left transition hover:border-primary/40 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
              <BuildingIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-foreground">
                For an organization
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                Employer or talent team. We set up your account after a short conversation —
                organizations do not self-register.
              </span>
            </span>
            <ArrowRightIcon />
          </button>

          <button
            type="button"
            onClick={() => choose("candidate")}
            className="flex w-full items-start gap-4 rounded-xl border border-border bg-card px-4 py-4 text-left transition hover:border-primary/40 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
              <UserIcon />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-foreground">
                As a student or candidate
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                Create your own account and continue to projects and your Signal.
              </span>
            </span>
            <ArrowRightIcon />
          </button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Already have credentials?{" "}
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
