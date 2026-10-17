"use client";

import { Suspense } from "react";
import { RequireEmployer } from "@/components/RequireEmployer";
import { LoadingState } from "@/components/ui/LoadingState";
import ProjectZipsClient from "./ProjectZipsClient";

export default function LibraryStudentPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState fullScreen />}>
        <ProjectZipsClient />
      </Suspense>
    </RequireEmployer>
  );
}
