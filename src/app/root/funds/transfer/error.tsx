"use client";

import ErrorFallback from "@/components/global/errorBoundary";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorFallback  className="min-h-[50vh]" error={error} reset={reset} />;
}
