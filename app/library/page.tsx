"use client";

import { Suspense } from "react";
import { RequireEmployer } from "@/components/RequireEmployer";
import { LoadingState } from "@/components/ui/LoadingState";
import LibraryStudentsClient from "./LibraryStudentsClient";

export default function LibraryPage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState fullScreen />}>
        <LibraryStudentsClient />
      </Suspense>
    </RequireEmployer>
  );
}
