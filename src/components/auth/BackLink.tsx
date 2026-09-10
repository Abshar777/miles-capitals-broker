"use client";
import { Icon } from "@/components/ui/icon";
import React from "react";
import { useRouter } from "next/navigation";

const BackLink = ({ href }: { href?: string }) => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      className="inline-flex items-center gap-2 h-6 text-[15px] leading-6 text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon name="arrow-left-16" size={16} />
      Back
    </button>
  );
};

export default BackLink;
