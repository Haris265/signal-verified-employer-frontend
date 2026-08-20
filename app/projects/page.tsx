"use client";

import { Suspense } from "react";
import { RequireEmployer } from "@/components/RequireEmployer";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsPage() {
  return (
    <RequireEmployer>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center text-sm text-ink-500">
            Loading…
          </div>
        }
      >
        <ProjectsClient />
      </Suspense>
    </RequireEmployer>
  );
}
