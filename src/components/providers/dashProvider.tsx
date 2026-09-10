"use client";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import KBar from "../layout/kbar";
import { ThemeProvider } from "../theme/ThemeProvider";
import { motion } from "framer-motion";
import { container_variants } from "@/constants/framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { KYCVerificationModal } from "../global/kycVerifyModal";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import WelcomeModal from "@/components/walkthrough/WelcomeModal";
import WalkthroughOverlay from "@/components/walkthrough/WalkthroughOverlay";
import { useWalkthroughStore } from "@/store/walkthroughStore";

const DashProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { initTour, showWelcome, isActive } = useWalkthroughStore();

  useEffect(() => {
    if (!session) {
      signOut();
    }
  }, [session]);

  const { user, isLoading } = useUser();
  const [isverified, setIsverified] = useState(false);
  useEffect(() => {
    if (user?.kyc_status === "pending" || user?.kyc_status === "rejected") {
      setIsverified(true);
    } else {
      setIsverified(false);
    }
  }, [user?.kyc_status]);
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(
    !pathname.startsWith("/root/verification")
  );
  useEffect(() => {
    if (pathname.startsWith("/root/verification")) {
      setShowModal(false);
    }
  }, [pathname]);

  const router = useRouter();
  const handleVerifyNow = () => {
    toast.success("Redirecting to KYC verification...", {
      description:
        "You want to enable more features, please complete your KYC verification",
    });
    router.push("/root/verification");
    setShowModal(false);
  };

  const handleDecline = () => {
    toast.warning("KYC verification declined", {
      description:
        "You want to enable more features, please complete your KYC verification",
    });
    setShowModal(false);
  };

  // Always init tour on mount — it shows first; KYC modal waits until tour is done/skipped
  useEffect(() => {
    initTour();
  }, []);


  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <KBar>
        <SidebarProvider className="h-lvh overflow-hidden">
          <AppSidebar />

          <SidebarInset className="overflow-hidden relative">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
            >
              <Header />
            </motion.div>
            <motion.div
              variants={container_variants}
              initial={"hidden"}
              animate={"visible"}
              exit={"hidden"}
              className="h-lvh  overflow-hidden"
            >
              {isverified && !isLoading && showModal && !showWelcome && !isActive && (
                <KYCVerificationModal
                  isKYCEnabled={false}
                  onVerifyNow={handleVerifyNow}
                  onDecline={handleDecline}
                />
              )}
              {children}
            </motion.div>
          </SidebarInset>
        </SidebarProvider>
      </KBar>

      {/* ── Walkthrough ─────────────────────────────────────── */}
      <WelcomeModal />
      <WalkthroughOverlay />
    </ThemeProvider>
  );
};

export default DashProvider;
