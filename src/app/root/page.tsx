import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description: "Client Dashboard",
};

const page = () => {
  return redirect("/root/dashboard");
};

export default page;
