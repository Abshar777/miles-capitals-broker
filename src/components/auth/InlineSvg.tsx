"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const cache = new Map<string, string>();

/**
 * Fetches an SVG from /public and inlines it so `var(--…)` fills inside the
 * artwork follow the current theme. The reference illustrations rely on
 * --text-main, --background, --field, --divider, --card, --accent and
 * --text-contrast, which are aliased here to our tokens.
 */
const InlineSvg = ({ src, className }: { src: string; className?: string }) => {
  const [html, setHtml] = useState<string>(() => cache.get(src) || "");

  useEffect(() => {
    let alive = true;
    if (cache.has(src)) {
      setHtml(cache.get(src)!);
      return;
    }
    fetch(src)
      .then((r) => r.text())
      .then((t) => {
        cache.set(src, t);
        if (alive) setHtml(t);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [src]);

  return (
    <div
      aria-hidden
      className={cn("[&>svg]:w-full [&>svg]:h-full", className)}
      style={
        {
          "--text-main": "var(--foreground)",
          "--text-contrast": "#ffffff",
          "--divider": "var(--border)",
          "--accent": "var(--primary)",
        } as React.CSSProperties
      }
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default InlineSvg;
