"use client";

import { RequireEmployer } from "@/components/RequireEmployer";
import { LoadingState } from "@/components/ui/LoadingState";
import { Suspense } from "react";
import PeopleClient from "./PeopleClient";

export default function PeoplePage() {
  return (
    <RequireEmployer>
      <Suspense fallback={<LoadingState fullScreen />}>
        <PeopleClient />
      </Suspense>
    </RequireEmployer>
  );
}
