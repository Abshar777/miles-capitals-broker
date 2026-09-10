"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldAlert,
  X,
  ArrowRight,
  CheckCircle2,
  Wallet,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer } from "vaul";

// ─── Props ────────────────────────────────────────────────────────────────────
interface KYCVerificationModalProps {
  isKYCEnabled?: boolean;
  onVerifyNow?: () => void;
  onDecline?: () => void;
}

// ─── Feature list ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Wallet, text: "Full deposit & withdrawal access" },
  { icon: TrendingUp, text: "Higher trading limits" },
  { icon: RefreshCcw, text: "Faster transaction approvals" },
] as const;

// ─── Shared inner content (used in both desktop card & mobile drawer) ─────────
function KYCContent({
  onVerifyNow,
  onDecline,
  isMobile = false,
}: {
  onVerifyNow?: () => void;
  onDecline?: () => void;
  isMobile?: boolean;
}) {
  return (
    <>
      {/* ── Header — primary bg, white text ── */}
      <div className="relative bg-primary px-5 pt-5 pb-4">
        {/* Close */}
        <button
          onClick={onDecline}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          {/* Icon bubble */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20"
          >
            <ShieldAlert className="w-6 h-6 text-white" />
          </motion.div>

          <div>
            <h3 className="text-white font-bold text-base leading-tight">
              KYC Verification
            </h3>
            <p className="text-white/75 text-xs mt-0.5">
              Identity verification required
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 180 }}
        className="px-5 py-4 space-y-4 bg-card"
      >
        <p className="text-muted-foreground text-sm leading-relaxed">
          Complete your KYC to unlock full platform access and ensure compliance
          with our policies.
        </p>

        {/* Feature checklist */}
        <ul className="space-y-2.5">
          {FEATURES.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.14 + i * 0.07,
                type: "spring",
                stiffness: 220,
                damping: 22,
              }}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm text-foreground/80 flex-1">{text}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary/50 shrink-0" />
            </motion.li>
          ))}
        </ul>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, type: "spring", stiffness: 180 }}
          className={`flex gap-2 pt-1 ${isMobile ? "pb-2" : ""}`}
        >
          <Button
            onClick={onVerifyNow}
            className="flex-1 gap-1.5 h-9 text-sm font-semibold rounded-xl"
          >
            Verify Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            className="flex-1 h-9 text-sm rounded-xl"
          >
            Later
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function KYCVerificationModal({
  isKYCEnabled = false,
  onVerifyNow,
  onDecline,
}: KYCVerificationModalProps) {
  const [visible, setVisible] = useState(!isKYCEnabled);
  const isMobile = useIsMobile();

  // Sync visibility when prop changes (e.g. after user data loads)
  useEffect(() => {
    setVisible(!isKYCEnabled);
  }, [isKYCEnabled]);

  const handleDecline = () => {
    setVisible(false);
    onDecline?.();
  };

  // ── Mobile: bottom drawer ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Drawer.Root open={visible} onOpenChange={(v) => !v && handleDecline()} direction="bottom">
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 outline-none">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="rounded-t-2xl overflow-hidden shadow-2xl"
            >
              {/* Drag handle */}
              <div className="flex justify-center bg-primary pt-3 pb-0">
                <div className="h-1.5 w-10 rounded-full bg-white/30" />
              </div>
              <KYCContent
                onVerifyNow={onVerifyNow}
                onDecline={handleDecline}
                isMobile
              />
            </motion.div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // ── Desktop: floating bottom-right card ───────────────────────────────────
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 48, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.85 }}
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
        >
          <div className="rounded-2xl shadow-2xl border border-border/40 overflow-hidden">
            <KYCContent
              onVerifyNow={onVerifyNow}
              onDecline={handleDecline}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
