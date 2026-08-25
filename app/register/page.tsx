"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getPersona, setPersona } from "@/lib/auth";
import { registerCandidate, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getPersona()) setPersona("candidate");
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await registerCandidate({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
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
        // Backend B2C register may not be live yet — fall back to email request
        const subject = encodeURIComponent("Candidate account request");
        const body = encodeURIComponent(
          `Hello,\n\nI would like to create a candidate account on SignalVerified.\n\nName: ${firstName.trim()} ${lastName.trim()}\nEmail: ${email.trim()}\n\nThank you.`
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
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="inline-flex w-fit rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
          <Logo height={48} className="h-12 w-auto" />
        </Link>

        <h1 className="mt-10 text-[26px] font-semibold tracking-tight text-foreground">
          Create your candidate account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          B2C self-registration for students and candidates. Organizations are set up by
          SignalVerified separately.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="first_name" className="text-[12.5px] font-medium text-foreground">
                First name
              </label>
              <input
                id="first_name"
                required
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="last_name" className="text-[12.5px] font-medium text-foreground">
                Last name
              </label>
              <input
                id="last_name"
                required
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="text-[12.5px] font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-[12.5px] font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

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

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          <Link href="/persona" className="font-medium text-primary underline-offset-4 hover:underline">
            ← Change persona
          </Link>
          {" · "}
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
