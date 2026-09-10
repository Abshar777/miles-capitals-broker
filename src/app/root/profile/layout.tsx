import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile 🧑 | Your Profile",
  description: "You can view your profile here",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
