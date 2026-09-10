"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  Mail,
  MousePointerClick,
  Wallet,
  ShieldCheck,
  ArrowRightCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface DepositTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const steps = [
  {
    icon: CreditCard,
    text: "Deposit With Your Credit or Debit Card",
  },
  {
    icon: Mail,
    text: "Check your registered email ID for the payment link.",
  },
  {
    icon: MousePointerClick,
    text: "Click on Link received And Make the Payment.",
  },
  {
    icon: Wallet,
    text: "Once payment is confirmed The Requested Amount will be credited in your wallet.",
  },
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
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function TermsContent({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5 pb-2"
    >
      {/* Steps */}
      <div className="flex flex-col gap-2.5">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className="flex items-start gap-3 rounded-xl bg-muted/50 border border-border/40 px-4 py-3"
            >
              <div className="flex items-center justify-center size-7 rounded-full bg-primary/15 text-primary shrink-0 mt-0.5">
                <span className="text-xs font-bold">{i + 1}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-1">
                <Icon className="size-4 text-muted-foreground shrink-0" />
                <p className="text-sm leading-snug text-foreground">{step.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border/60" />
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          Terms &amp; Conditions for Payment Link
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </motion.div>

      {/* T&C Items */}
      <div className="flex flex-col gap-3">
        {terms.map((term, i) => {
          const Icon = term.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`rounded-xl border ${term.borderColor} ${term.bgColor} px-4 py-3.5`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`size-4 ${term.iconColor} shrink-0`} />
                <p className="text-sm font-semibold text-foreground">{term.title}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                {term.body}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2.5 pt-1">
        <Button
          onClick={onConfirm}
          className="w-full h-11 font-semibold gap-2 text-sm"
        >
          <ArrowRightCircle className="size-4" />
          I Agree &amp; Continue
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full h-11 text-sm"
        >
          Cancel
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function DepositTermsModal({ isOpen, onClose, onConfirm }: DepositTermsModalProps) {
  const isMobile = useIsMobile();

  const handleConfirm = () => {
    onClose();
    onConfirm();
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} shouldScaleBackground>
        <DrawerContent className="px-4 pb-6 max-h-[92vh]">
          <ScrollArea className="flex-1 overflow-y-auto">
            <DrawerHeader className="pb-2 pt-4 px-0 text-center">
              <div className="flex justify-center mb-3">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
                  className="size-12 rounded-2xl bg-primary/15 flex items-center justify-center"
                >
                  <CreditCard className="size-6 text-primary" />
                </motion.div>
              </div>
              <DrawerTitle className="text-lg font-semibold">Payment Link Deposit</DrawerTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Please review the steps and terms before proceeding
              </p>
            </DrawerHeader>

            <div className="px-0.5 pb-2">
              <TermsContent onClose={onClose} onConfirm={handleConfirm} />
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0 flex flex-col max-h-[88vh]">
        <ScrollArea className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, duration: 0.25 }}
                className="relative flex flex-col flex-1 min-h-0"
              >
                {/* Top accent bar — fixed, never scrolls */}
                <div className="h-1 w-full shrink-0 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-lg" />

                {/* Header — fixed, never scrolls */}
                <div className="px-6 pt-5 pb-3 shrink-0">
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.08 }}
                        className="size-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0"
                      >
                        <CreditCard className="size-5 text-primary" />
                      </motion.div>
                      <div>
                        <DialogTitle className="text-base font-semibold leading-tight">
                          Payment Link Deposit
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Review steps &amp; terms before proceeding
                        </p>
                      </div>
                    </div>
                  </DialogHeader>
                </div>

                {/* Scrollable body — fills remaining space */}
                <ScrollArea className="flex-1 min-h-0 px-6 pb-6">
                  <TermsContent onClose={onClose} onConfirm={handleConfirm} />
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
