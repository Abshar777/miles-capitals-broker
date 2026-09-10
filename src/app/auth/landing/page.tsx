import React from "react";
import { Metadata } from "next";
import AuthButton from "@/components/auth/AuthButton";
import FeatureCarousel from "@/components/auth/FeatureCarousel";

export const metadata: Metadata = {
  title: "MILES CAPITAL",
  description: "Start trading today with Miles Capital",
};

const LandingPage = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-6">
      <div className="w-full max-w-[880px] flex flex-col lg:flex-row items-center gap-10 lg:gap-0">
        <div className="flex-1 w-full max-w-[420px] lg:max-w-none select-none">
          <h1 className="text-[44px] leading-[52px] sm:text-[64px] sm:leading-[72px] font-medium text-foreground max-w-[420px]">
            Start Trading Today
          </h1>
          <h3 className="text-[18px] leading-6 text-muted-foreground mt-4 mb-[30px] max-w-[420px]">
            Join our platform and invest with confidence. Register now and make your investment
            choice.
          </h3>
          <AuthButton href="/auth/register" size="md" className="h-12 px-6">
            Create Account
          </AuthButton>
        </div>

        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <FeatureCarousel />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
