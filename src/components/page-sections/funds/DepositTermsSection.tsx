"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Mail,
  MousePointerClick,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  FileText,
} from "lucide-react";

const steps = [
  { icon: CreditCard,        text: "Deposit With Your Credit or Debit Card" },
  { icon: Mail,              text: "Check your registered email ID for the payment link." },
  { icon: MousePointerClick, text: "Click on Link received And Make the Payment." },
  { icon: Wallet,            text: "Once payment is confirmed The Requested Amount will be credited in your wallet." },
];

const terms = [
  {
    title: "Deposit and Withdrawal Policy",
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    body: "If you make a deposit through the payment link and subsequently withdraw the same deposit amount without transferring to trading accounts, engaging in any trading activities, a fee of 5% for Local and 6.5% for international will be applied to your withdrawal.",
  },
  {
    title: "Fee Structure",
    icon: ShieldCheck,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
    body: "The 5% fee for local and 6.5% for international will be deducted from the amount being withdrawn, in addition to any charges imposed by the payment link provider.",
  },
  {
    title: "Acknowledgment",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    body: "By using the payment link, you acknowledge and agree to these terms and conditions.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

export function DepositTermsSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-border/50 bg-card hover:bg-muted/70 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <FileText className="size-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Terms &amp; Conditions for Payment Link
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="shrink-0"
        >
          <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="terms-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="overflow-hidden"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4 pt-3"
            >
              {/* Steps */}
              <div className="flex flex-col gap-2">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-start gap-3 rounded-xl bg-card border border-border/40 px-4 py-3"
                    >
                      <div className="flex items-center justify-center size-6 rounded-full bg-primary/15 text-primary shrink-0 mt-0.5">
                        <span className="text-xs font-bold">{i + 1}</span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-1">
                        {/* <Icon className="size-3.5 text-muted-foreground shrink-0" /> */}
                        <p className="text-sm leading-snug text-foreground">{step.text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
                  Policies
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </motion.div>

              {/* T&C cards */}
              <div className="flex flex-col gap-2.5">
                {terms.map((term, i) => {
                  const Icon = term.icon;
                  return (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className={`rounded-xl border ${term.borderColor} ${term.bgColor} px-4 py-3`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`size-3.5 ${term.iconColor} shrink-0`} />
                        <p className="text-sm font-semibold text-foreground">{term.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                        {term.body}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
