import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fallbackCopy = (text: string) => {
  if (typeof window === "undefined") return toast.error("Failed to copy");
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand("copy");
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Failed to copy");
  }

  document.body.removeChild(textarea);
};

export const copyToClipboard = async (text: string) => {
  if (typeof window === "undefined") return toast.error("Failed to copy");
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } else {
      fallbackCopy(text);
    }
  } catch (err) {
    fallbackCopy(text);
  }
};

export const cleanParams = (params: any) => {
  Object.entries(params).forEach(([key, value]) => {
    if (value === "all" || (typeof value == "string" && value.trim() === "")) {
      delete params[key];
    }
  });
  return params;
};

// ── IST date formatter ──────────────────────────────────────────
// All timestamps in the CRM are stored as UTC. This utility converts
// them to IST (Asia/Kolkata, UTC+5:30) for display. Change the
// timeZone value here to switch the entire app to a different zone.
export const formatIST = (
  date: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  },
): string => {
  if (!date) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      ...options,
      timeZone: "Asia/Kolkata",
    }).format(new Date(date));
  } catch {
    return "—";
  }
};
