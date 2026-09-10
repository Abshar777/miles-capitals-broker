import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Upgrade Level 📃 | Upgrade your verification level",
  description: "You can upgrade your verification level here",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
