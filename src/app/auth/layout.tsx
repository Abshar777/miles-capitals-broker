import { Metadata } from "next";
import React from "react";
import AuthShell from "@/components/auth/AuthShell";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "MILES CAPITAL",
  description: "Miles Capital client portal",
};

const layout = ({ children }: Props) => <AuthShell>{children}</AuthShell>;

export default layout;
