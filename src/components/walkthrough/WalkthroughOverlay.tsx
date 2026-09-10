"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useWalkthroughStore } from "@/store/walkthroughStore";
import { walkthroughSteps } from "./steps";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 10;        // padding around spotlight box
const TOOLTIP_W = 300; // desktop tooltip width

function getRect(selector: string): Rect | null {
  if (typeof window === "undefined") return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function ensureFundsOpen(callback: () => void) {
  const trigger = document.querySelector('[data-tour="nav-funds"]') as HTMLElement | null;
  if (!trigger) { callback(); return; }
  const depositEl = document.querySelector('[data-tour="nav-deposit"]');
  if (depositEl) { callback(); return; }
  trigger.click();
  setTimeout(callback, 350);
}

export default function WalkthroughOverlay() {
  const { isActive, currentStep, totalSteps, nextStep, prevStep, skipTour } =
    useWalkthroughStore();

  const step = walkthroughSteps[currentStep];
  const [rect, setRect] = useState<Rect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef<number>(0);

  // Detect mobile (< 768px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const measure = useCallback(() => {
    if (!step) return;
    // On mobile, sidebar nav items are hidden in closed drawer — skip spotlight
    if (isMobile) { setRect(null); return; }
    setRect(getRect(step.target));
  }, [step, isMobile]);

  useEffect(() => {
    if (!isActive || !step) { setRect(null); return; }

    const run = () => {
      if (step.requiresFundsOpen) {
        ensureFundsOpen(() => setTimeout(measure, 80));
      } else {
        setTimeout(measure, 80);
      }
    };
    run();

    const onResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, currentStep, step, measure]);

  if (!isActive) return null;

  // Spotlight box with padding
  const spot = rect
    ? { top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }
    : null;

  // Desktop tooltip position (right of spotlight, or fallback to centered-bottom)
  const tooltipPos = (() => {
    if (isMobile || !spot) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (step.position === "right") {
      const left = spot.left + spot.width + 16;
      return left + TOOLTIP_W < vw - 8
        ? { left, top: Math.max(8, Math.min(spot.top, vh - 260)) }
        : { left: spot.left - TOOLTIP_W - 16, top: Math.max(8, Math.min(spot.top, vh - 260)) };
    }
    if (step.position === "top") {
      return {
        left: Math.max(8, Math.min(spot.left, vw - TOOLTIP_W - 8)),
        top: Math.max(8, spot.top - 230),
      };
    }
    return {
      left: Math.max(8, Math.min(spot.left, vw - TOOLTIP_W - 8)),
      top: Math.max(8, Math.min(spot.top, vh - 260)),
    };
  })();

  // Desktop fallback position: center-bottom when target not found
  const desktopFallback = !isMobile && !spot;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      {isActive && (
        <div key="tour-root" className="fixed inset-0 z-[9992]" style={{ pointerEvents: "none" }}>

          {/* ── 1. Dark backdrop — always visible ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              inset: 0,
              // If spotlight exists (desktop), backdrop is transparent here —
              // the spotlight's box-shadow provides the dark area.
              // On mobile (no spotlight), we draw the full dark overlay.
              background: spot ? "transparent" : "rgba(0,0,0,0.75)",
              zIndex: 9993,
              pointerEvents: "all",
              backdropFilter: isMobile ? "blur(2px)" : "none",
            }}
            onClick={nextStep}
          />

          {/* ── 2. Spotlight (desktop only, when target found) ──────────────── */}
          <AnimatePresence mode="wait">
            {spot && !isMobile && (
              <motion.div
                key={`spot-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                style={{
                  position:      "fixed",
                  top:           spot.top,
                  left:          spot.left,
                  width:         spot.width,
                  height:        spot.height,
                  borderRadius:  12,
                  boxShadow:     "0 0 0 9999px rgba(0,0,0,0.78)",
                  border:        "2px solid hsl(var(--primary) / 0.85)",
                  zIndex:        9994,
                  pointerEvents: "none",
                }}
              >
                {/* Pulsing ring */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.85, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    position:      "absolute",
                    inset:         -6,
                    borderRadius:  17,
                    border:        "1.5px solid hsl(var(--primary) / 0.4)",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 3. Desktop tooltip (target found) ──────────────────────────── */}
          <AnimatePresence mode="wait">
            {!isMobile && tooltipPos && (
              <motion.div
                key={`tip-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9, x: step.position === "right" ? -10 : 0, y: step.position === "top" ? 10 : 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 340, damping: 28, delay: 0.06 }}
                style={{
                  position:      "fixed",
                  top:           tooltipPos.top,
                  left:          tooltipPos.left,
                  width:         TOOLTIP_W,
                  zIndex:        9999,
                  pointerEvents: "all",
                }}
              >
                <TooltipCard {...{ step, currentStep, totalSteps, progress, onPrev: prevStep, onNext: nextStep, onSkip: skipTour }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 4. Desktop fallback tooltip (target not found, no sidebar item) */}
          <AnimatePresence mode="wait">
            {desktopFallback && (
              <motion.div
                key={`fallback-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                style={{
                  position:      "fixed",
                  bottom:        32,
                  left:          "50%",
                  transform:     "translateX(-50%)",
                  width:         TOOLTIP_W + 40,
                  zIndex:        9999,
                  pointerEvents: "all",
                }}
              >
                <TooltipCard {...{ step, currentStep, totalSteps, progress, onPrev: prevStep, onNext: nextStep, onSkip: skipTour }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 5. Mobile bottom sheet (ONLY on mobile, replaces tooltip+fallback) */}
          <AnimatePresence mode="wait">
            {isMobile && (
              <motion.div
                key={`mobile-${currentStep}`}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position:      "fixed",
                  bottom:        0,
                  left:          0,
                  right:         0,
                  zIndex:        9999,
                  pointerEvents: "all",
                  padding:       "0 12px 28px",
                }}
                onClick={(e) => e.stopPropagation()} // prevent backdrop click from firing too
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                  <TooltipCard
                    step={step}
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    progress={progress}
                    onPrev={prevStep}
                    onNext={nextStep}
                    onSkip={skipTour}
                    mobile
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </AnimatePresence>
  );
}


// ── Tooltip Card ─────────────────────────────────────────────────────────────

interface TooltipCardProps {
  step: (typeof walkthroughSteps)[number];
  currentStep: number;
  totalSteps: number;
  progress: number;
  onPrev: () => void;
  onNext: () => void;
  onSkip: () => void;
  mobile?: boolean;
}

function TooltipCard({ step, currentStep, totalSteps, progress, onPrev, onNext, onSkip, mobile }: TooltipCardProps) {
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="bg-card border border-border/70 rounded-2xl shadow-2xl overflow-hidden select-none">
      {/* Progress bar */}
      <div className="h-0.5 bg-muted w-full">
        <motion.div
          className="h-full bg-primary"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className={mobile ? "p-5" : "p-4"}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg flex-shrink-0">
              {step.emoji}
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps}
              </p>
              <h3 className={`font-bold leading-tight ${mobile ? "text-base" : "text-sm"}`}>
                {step.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted flex-shrink-0 -mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className={`text-muted-foreground leading-relaxed mb-4 ${mobile ? "text-sm" : "text-xs"}`}>
          {step.description}
        </p>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1 mb-3.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width:   i === currentStep ? 18 : 4,
                opacity: i === currentStep ? 1 : i < currentStep ? 0.5 : 0.2,
              }}
              transition={{ duration: 0.25 }}
              className="h-1 rounded-full bg-primary"
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={onPrev}
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className={`flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all ${mobile ? "py-3 text-sm" : "py-2 text-xs"}`}
          >
            {isLast ? "🎉 Finish Tour" : (<>Next <ChevronRight className="w-3.5 h-3.5" /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}
