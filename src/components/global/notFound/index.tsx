"use client";

import { motion } from "framer-motion";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface NotFoundFallbackProps {
  className?: string;
}

export default function NotFoundFallback({ className }: NotFoundFallbackProps) {
  const router = useRouter();

  return (
    <div
      className={`flex min-h-[75vh] w-full flex-col items-center justify-center bg-background p-4 ${className ?? ""}`}
    >
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
          className="flex h-20 w-20 items-center justify-center rounded-full bg-muted"
        >
          <SearchX className="h-9 w-9 text-muted-foreground" strokeWidth={1.5} />
        </motion.div>

        {/* 404 number */}
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 110 }}
          className="text-8xl font-extrabold tracking-tight text-foreground/60 select-none"
        >
          404
        </motion.span>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col gap-2 -mt-4"
        >
          <h1 className="text-2xl font-bold text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-foreground/60 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
