"use client";
import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { FaUpload } from "react-icons/fa";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Same limits the backend enforces (app/utils/proof_upload.py).
export const PROOF_MAX_IMAGES = 5;
export const PROOF_MAX_MB = 5;
export const PROOF_ACCEPT = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  value?: File[];
  onChange: (files: File[]) => void;
  label: string;
  required?: boolean;
  hasError?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
};

/** Pick up to `maxFiles` proof images (jpg/png/webp), with thumbnails and per-image remove. */
const ProofImagesUpload = ({
  value,
  onChange,
  label,
  required = false,
  hasError = false,
  maxFiles = PROOF_MAX_IMAGES,
  maxSizeMB = PROOF_MAX_MB,
  className,
}: Props) => {
  const files = useMemo(() => value ?? [], [value]);
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    const next = [...files];
    for (const file of Array.from(picked)) {
      if (!PROOF_ACCEPT.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG or WEBP images are allowed`);
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name}: must be smaller than ${maxSizeMB} MB`);
        continue;
      }
      if (next.length >= maxFiles) {
        toast.error(`You can upload at most ${maxFiles} images`);
        break;
      }
      next.push(file);
    }
    onChange(next);
  };

  const removeAt = (index: number) => onChange(files.filter((_, i) => i !== index));
  const full = files.length >= maxFiles;

  return (
    <FormItem className={cn("w-full", className)}>
      <FormLabel className="flex items-center gap-1 text-[15px] leading-6 font-normal text-muted-foreground">
        {label}
        {required && <span className="text-primary">*</span>}
      </FormLabel>
      <button
        type="button"
        disabled={full}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex h-14 w-full items-center gap-2 rounded-[4px] border border-dashed bg-field px-4 text-[15px] text-foreground transition-colors",
          "border-muted-foreground/30 hover:border-primary/60 disabled:cursor-not-allowed disabled:opacity-60",
          hasError && "errInput",
        )}
      >
        <FaUpload className="text-sm shrink-0" />
        <span className="truncate">
          {full ? `Maximum ${maxFiles} images added` : files.length ? "Add more images" : "Upload images"}
        </span>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">
          {files.length}/{maxFiles}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={PROOF_ACCEPT.join(",")}
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = ""; // allow picking the same file again after removing it
        }}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP · up to {maxSizeMB} MB each · max {maxFiles} images
      </p>
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[4px] border border-foreground/10 bg-field"
            >
              <Image src={previews[i]} alt={file.name} fill unoptimized className="object-cover" />
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 text-foreground hover:bg-destructive hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <FormMessage />
    </FormItem>
  );
};

export default ProofImagesUpload;
