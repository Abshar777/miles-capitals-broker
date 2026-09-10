"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { item_variants } from "@/constants/framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import WithdrawForm from "@/components/forms/withdrawForm";
import { useUser } from "@/hooks/useUser";
import { KYCVerificationModal } from "@/components/global/kycVerifyModal";
import { useRouter } from "nextjs-toploader/app";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@heroui/react";
import { statusBadge } from "@/constants/curency";
import { ShieldX, ArrowRight, ShieldCheck } from "lucide-react";

// ─── KYC status label map ─────────────────────────────────────────────────────
const KYC_LABEL: Record<string, string> = {
  pending: "Your KYC is pending review. Submit your documents to get approved.",
  submitted:
    "Your documents are under review. Withdrawals will be unlocked once approved.",
  rejected:
    "Your KYC was rejected. Please re-submit your documents to continue.",
};

// ─── Blocked state shown when KYC is not approved ────────────────────────────
function KYCGate({
  kycStatus,
  onVerifyNow,
}: {
  kycStatus: string;
  onVerifyNow: () => void;
}) {
  const isRejected = kycStatus === "rejected";

  return (
    <motion.div
      key="kyc-gate"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="flex flex-col items-center gap-5 py-10 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 240, damping: 20 }}
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          isRejected ? "bg-destructive/20" : "bg-primary/10"
        }`}
      >
        <ShieldX
          className={`h-10 w-10 ${
            isRejected ? "text-destructive" : "text-primary"
          }`}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, type: "spring", stiffness: 180 }}
        className="flex flex-col items-center gap-2"
      >
        <h3 className="text-[18px] leading-6 font-medium text-foreground">
          KYC Verification Required
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
          {KYC_LABEL[kycStatus] ??
            "Complete your KYC verification to unlock withdrawals."}
        </p>
      </motion.div>

      {/* Current status badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <Badge
          variant={
            statusBadge[kycStatus as keyof typeof statusBadge] as any
          }
          className="gap-1.5 px-3 py-1 text-xs font-medium capitalize"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          KYC: {kycStatus}
        </Badge>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, type: "spring", stiffness: 180 }}
      >
        <Button
          onClick={onVerifyNow}
          className="gap-2"
        >
          {isRejected ? "Re-submit Documents" : "Complete Verification"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
const WithdrawCard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [showKycModal, setShowKycModal] = useState(false);

  const isApproved = user?.kyc_status === "approved";

  const handleVerifyNow = () => {
    setShowKycModal(false);
    router.push("/root/verification");
  };

  return (
    <>
      {/* KYC modal — only mount after data loads and user is NOT approved */}
      {!isLoading && !isApproved && (
        <KYCVerificationModal
          isKYCEnabled={false}
          onVerifyNow={handleVerifyNow}
          onDecline={() => setShowKycModal(false)}
        />
      )}

      <motion.div className="md:col-span-2 md:pr-6" variants={item_variants}>
        <Card className="bg-transparent py-0 gap-4">
          <CardHeader className="px-0"><CardTitle>Withdraw</CardTitle><CardDescription>Admin will review your request and approve it, after that you will receive your funds in your account.</CardDescription></CardHeader>

          <CardContent className="relative px-0 pb-10">
            {isLoading ? (
              <div className="flex h-40 w-full items-center justify-center">
                <Spinner size="sm" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {isApproved ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <WithdrawForm />
                  </motion.div>
                ) : (
                  <KYCGate
                    key="gate"
                    kycStatus={user?.kyc_status || "pending"}
                    onVerifyNow={() => {
                      
                      router.push("/root/verification");
                    }}
                  />
                )}
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default WithdrawCard;
