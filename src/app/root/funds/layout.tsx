import FundsLayout from "@/components/page-sections/funds/fundsLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Funds 💸 | Deposit & Transfer",
  description: "You can deposit and transfer your funds here",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <FundsLayout>{children}</FundsLayout>
    </>
  );
};

export default layout;
