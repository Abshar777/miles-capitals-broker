import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard 👋 | Mt5 Client",
  description: "Dashboard",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
