"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Shield, TrendingUp } from "lucide-react";
import { useWalkthroughStore } from "@/store/walkthroughStore";

const features = [
  { icon: TrendingUp, label: "Deposits & Withdrawals" },
  { icon: Zap,        label: "MT5 Account Management" },
  { icon: Shield,     label: "Secure Internal Transfers" },
];

export default function WelcomeModal() {
  const { showWelcome, startTour, skipTour } = useWalkthroughStore();

  return (
    <AnimatePresence>
      {showWelcome && (
        <>
          {/* Backdrop */}
          <motion.div
            key="welcome-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9990]"
            style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            key="welcome-modal"
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 32 }}
            transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.05 }}
            className="fixed inset-0 z-[9991] flex items-center justify-center p-4"
            style={{ pointerEvents: "none" }}
          >
            <div
              className="relative bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-[420px] overflow-hidden"
              style={{ pointerEvents: "all" }}
            >
              {/* Top gradient bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />

              <div className="p-7">
                {/* Close */}
                <button
                  onClick={skipTour}
                  className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Brand mark */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 20 }}
                  className="flex items-center justify-center mb-5"
                >
                  {/* Square mark is 48x48; keep width and height in step so it cannot
                      overflow the modal and overlap the heading. */}
                  <img
                    src="/miles/logo-short.svg"
                    alt="Miles Capital"
                    width={72}
                    height={72}
                    className="size-[72px] shrink-0"
                  />
                </motion.div>

                {/* Heading */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <h2 className="text-xl font-bold tracking-tight mb-1">
                    Welcome to Miles Capital
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Take a quick guided tour of the platform. We'll walk you through
                    everything you need to get started.
                  </p>
                </motion.div>

                {/* Feature pills */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 my-5"
                >
                  {features.map(({ icon: Icon, label }, i) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.34 + i * 0.07 }}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {label}
                    </motion.div>
                  ))}
                </motion.div>

                <p className="text-xs text-muted-foreground mb-5">
                  ✦ Takes about 2 minutes &nbsp;·&nbsp; Skip any time
                </p>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.46 }}
                  className="flex gap-2"
                >
                  <button
                    onClick={startTour}
                    className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    Start Tour →
                  </button>
                  <button
                    onClick={skipTour}
                    className="px-4 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted"
                  >
                    Skip
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
