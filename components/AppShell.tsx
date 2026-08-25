"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { clearSession, getUser } from "@/lib/auth";
import type { AuthUser, Entitlement } from "@/lib/types";

export function AppShell({
  children, 
  orgName,
  entitlement,
  mainClassName = "",
}: {
  children: React.ReactNode;
  orgName?: string;
  entitlement?: Entitlement | null;
  mainClassName?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const org = orgName || entitlement?.name;
  const onProjects = pathname.startsWith("/projects");

  useEffect(() => {
    setUser(getUser());
  }, []);

  function signOut() {
    clearSession();
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <Link href="/projects" className="shrink-0">
            <Logo height={40} className="h-10 w-auto" />
          </Link>
          {org && (
            <>
              <span className="h-5 w-px bg-border" aria-hidden />
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.32em] text-foreground sm:inline">
                {org}
              </span>
            </>
          )}
          <nav className="ml-6 hidden items-center gap-1 text-sm md:flex">
            <Link
              href="/projects"
              className={`rounded-md px-2.5 py-1.5 transition ${
                onProjects
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              Projects
            </Link>
            {/* Visual parity — People route out of MVP scope */}
            <span className="cursor-default rounded-md px-2.5 py-1.5 text-muted-foreground">
              People
            </span>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={signOut}
              className="text-foreground/70 transition hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto max-w-6xl px-6 ${mainClassName || "py-16"}`}>
        {children}
      </main>

      <footer className="no-print mt-24 border-t border-border/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Logo height={40} className="h-10 w-auto" />
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
                href="mailto:questions@signalverified.net"
                className="text-primary underline-offset-4 hover:underline"
              >
                questions@signalverified.net
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
