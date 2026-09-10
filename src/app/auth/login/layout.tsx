import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | MILES CAPITAL",
  description: "Sign in to your Miles Capital account",
};

const layout = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default layout;
