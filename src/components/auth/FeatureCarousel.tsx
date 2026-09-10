"use client";
import { Icon } from "@/components/ui/icon";
import React, { useCallback, useEffect, useState } from "react";
import InlineSvg from "./InlineSvg";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    img: "/miles/slide-0.svg",
    title: "Make Flexible Deposits",
    text: "Make deposits with variable currencies and payment options",
  },
  {
    img: "/miles/slide-1.svg",
    title: "Take Control of Your Trades",
    text: "Monitor balances, track performance, and trade seamlessly",
  },
  {
    img: "/miles/slide-2.svg",
    title: "All Wallets in One Place",
    text: "Easily manage and control all your wallets from a common place",
  },
  {
    img: "/miles/slide-3.svg",
    title: "All Finance Operations",
    text: "Monitor every finance operations in one place easily",
  },
];

const AUTOPLAY_MS = 5000;

/** Landing-page carousel: 420px wide, illustration + title + caption + arrows + dots. */
const FeatureCarousel = () => {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next: number, d: number) => {
    setDir(d);
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, go]);

  const slide = SLIDES[index];
  const atStart = index === 0;
  const atEnd = index === SLIDES.length - 1;

  return (
    <div className="relative w-full max-w-[420px] flex flex-col items-center overflow-hidden select-none">
      <button
        type="button"
        aria-label="Previous"
        onClick={() => go(index - 1, -1)}
        disabled={atStart}
        className={cn(
          "absolute left-0 top-[35%] z-10 size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
          atStart && "text-muted-foreground/40 hover:text-muted-foreground/40 cursor-default"
        )}
      >
        <Icon name="chevron-left-16" size={16} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={() => go(index + 1, 1)}
        disabled={atEnd}
        className={cn(
          "absolute right-0 top-[35%] z-10 size-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
          atEnd && "text-muted-foreground/40 hover:text-muted-foreground/40 cursor-default"
        )}
      >
        <Icon name="chevron-right-16" size={16} />
      </button>

      <div className="relative w-full h-[400px] overflow-hidden">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ x: dir * 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -dir * 420, opacity: 0 }}
            transition={{ type: "tween", duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="w-full flex flex-col items-center"
          >
            <div className="relative w-full max-w-[420px] h-[280px] overflow-hidden">
              <InlineSvg src={slide.img} className="absolute inset-0 w-full h-full" />
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-b from-transparent to-background" />
            </div>
            <div className="w-[80%] mt-6 flex flex-col items-center gap-4 text-center">
              <h1 className="text-[24px] leading-8 font-medium text-foreground">{slide.title}</h1>
              <div className="text-[15px] leading-6 text-muted-foreground">{slide.text}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="h-16 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i, i > index ? 1 : -1)}
            className={cn(
              "size-2 rounded-full transition-colors",
              i === index ? "bg-primary" : "bg-muted-foreground/40 hover:bg-muted-foreground"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCarousel;
