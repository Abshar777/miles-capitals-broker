import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Transactions 💸 | Deposit History & Withdraw History",
  description: "You can deposit and withdraw your funds here",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
