import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verification 📃 | Verification Level 0 & 1",
  description: "You can verify your account here",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
