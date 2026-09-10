"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  className?:string
}

export default function ErrorFallback({ error, reset,className }: ErrorFallbackProps) {
  const router = useRouter();

  return (
    <div className={`flex min-h-[75vh] w-full flex-col items-center justify-center bg-background p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 18 }}
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertTriangle className="h-9 w-9 text-destructive" strokeWidth={1.5} />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            {error?.message
              ? error.message
              : "An unexpected error occurred. Please try again or return home."}
          </p>
          {error?.digest && (
            <p className="mt-1 font-mono text-xs text-foreground/30">
              Error ID: {error.digest}
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
          <Button
            className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={reset}
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
