"use client";

import { ITermsCondition, TermsSection, TermsSectionItem, SectionColor } from "@/types/terms";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";

// ── Colour map ─────────────────────────────────────────────────────────────────

const colorMap: Record<SectionColor, { bg: string; border: string; text: string; badge: string }> = {
  default: {
    bg: "bg-muted/40",
    border: "border-border",
    text: "text-foreground",
    badge: "bg-muted text-muted-foreground",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-600 dark:text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-600 dark:text-green-400",
    badge: "bg-green-500/20 text-green-600 dark:text-green-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-600 dark:text-red-400",
    badge: "bg-red-500/20 text-red-600 dark:text-red-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  },
};

const getColor = (color?: string) =>
  colorMap[(color as SectionColor) ?? "default"] ?? colorMap.default;

// ── Steps section ──────────────────────────────────────────────────────────────

const StepsSection = ({ items, label }: { items: TermsSectionItem[]; label: string }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
    )}
    <ol className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-sm text-foreground/80 pt-0.5">{item.text}</span>
        </li>
      ))}
    </ol>
  </div>
);

// ── Card section (policy / terms / acknowledgment / custom) ───────────────────

const CardSection = ({ items, label }: { items: TermsSectionItem[]; label: string }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
    )}
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const c = getColor(item.color);
        return (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-3 flex flex-col gap-1",
              c.bg,
              c.border
            )}
          >
            {item.title && (
              <p className={cn("text-xs font-semibold", c.text)}>{item.title}</p>
            )}
            {item.body && (
              <p className="text-xs text-foreground/75 leading-relaxed">{item.body}</p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// ── Acknowledgment section (special: icon + green by default) ─────────────────

const AcknowledgmentSection = ({ items, label }: { items: TermsSectionItem[]; label: string }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <h4 className="text-sm font-semibold text-foreground">{label}</h4>
    )}
    {items.map((item, i) => {
      const c = getColor(item.color ?? "green");
      return (
        <div
          key={i}
          className={cn("rounded-lg border p-3 flex items-start gap-2.5", c.bg, c.border)}
        >
          <FaCheckCircle className={cn("flex-shrink-0 mt-0.5 text-base", c.text)} />
          <div className="flex flex-col gap-0.5">
            {item.title && (
              <p className={cn("text-xs font-semibold", c.text)}>{item.title}</p>
            )}
            {item.body && (
              <p className="text-xs text-foreground/75 leading-relaxed">{item.body}</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

// ── Single section router ──────────────────────────────────────────────────────

const SectionRenderer = ({ section }: { section: TermsSection }) => {
  if (!section.items || section.items.length === 0) return null;

  switch (section.type) {
    case "steps":
      return <StepsSection items={section.items} label={section.section_label} />;
    case "acknowledgment":
      return <AcknowledgmentSection items={section.items} label={section.section_label} />;
    case "policy":
    case "terms":
    case "custom":
    default:
      return <CardSection items={section.items} label={section.section_label} />;
  }
};

// ── Main TermsDisplay ──────────────────────────────────────────────────────────

interface TermsDisplayProps {
  terms: ITermsCondition[];
  isLoading?: boolean;
  className?: string;
}

const TermsDisplay = ({ terms, isLoading, className }: TermsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!terms || terms.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {terms.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-3">
          {entry.title && (
            <h3 className="text-sm font-semibold text-foreground border-b border-border/50 pb-1.5">
              {entry.title}
            </h3>
          )}
          {Array.isArray(entry.content) &&
            entry.content.map((section, idx) => (
              <SectionRenderer key={idx} section={section} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default TermsDisplay;
