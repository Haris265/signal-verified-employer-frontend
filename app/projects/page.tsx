"use client";

import { Suspense } from "react";
import { RequireEmployer } from "@/components/RequireEmployer";
import { LoadingState } from "@/components/ui/LoadingState";
import ProjectsClient from "./ProjectsClient";

export default function ProjectsPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState fullScreen />}>
        <ProjectsClient />
      </Suspense>
    </RequireEmployer>
  );
}
