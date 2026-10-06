"use client";
import React from "react";

/** Thumbnails of uploaded proof images; click one to open it full size in a new tab. */
const ProofImagesGallery = ({ urls, title = "Proof Images" }: { urls?: (string | null | undefined)[] | null; title?: string }) => {
  const list = (urls ?? []).filter((u): u is string => !!u);
  if (!list.length) return null;
  return (
    <div className="col-span-2">
      <p className="mb-2 font-medium">
        {title} ({list.length})
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {list.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${url}-${i}`}
            src={url}
            alt={`${title} ${i + 1}`}
            className="aspect-square w-full rounded-lg border object-cover cursor-pointer hover:opacity-80"
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          />
        ))}
      </div>
    </div>
  );
};

export default ProofImagesGallery;
