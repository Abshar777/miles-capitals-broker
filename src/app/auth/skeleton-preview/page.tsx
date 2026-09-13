"use client";
// TEMPORARY: renders the auth loading skeletons for visual verification. Deleted after check.
import { useSearchParams } from "next/navigation";
import Login from "@/app/auth/login/loading";
import Register from "@/app/auth/register/loading";
import Forgot from "@/app/auth/forgot-password/loading";
import Reset from "@/app/auth/reset-password/loading";
import Otp from "@/app/auth/otp/loading";

export default function SkeletonPreview() {
  const p = useSearchParams().get("p") || "login";
  return (
    <>
      {p === "login" && <Login />}
      {p === "register" && <Register />}
      {p === "forgot" && <Forgot />}
      {p === "reset" && <Reset />}
      {p === "otp" && <Otp />}
    </>
  );
}
