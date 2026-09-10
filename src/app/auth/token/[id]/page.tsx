"use client";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import Authloading from "../../login/loading";
import { toast } from "sonner";

const page = () => {
  const params = useParams();
  const router = useRouter();
  const token = params.id as string;
  const searchParams = useSearchParams();

  const { data: session } = useSession()


  useEffect(() => {
    if (typeof window !== "undefined") {
      if (session) {
        signOut().then(() => {
          localStorage.setItem("__accessToken", token);
          signIn("credentials", {
            email: searchParams.get("email") as string,
            token: token,
            redirect: false,
            id: searchParams.get("id") as string,
          }).then(() => {
            router.push("/root/dashboard");
          });

        })
      } else {
        localStorage.setItem("__accessToken", token);
        signIn("credentials", {
          email: searchParams.get("email") as string,
          token: token,
          redirect: false,
          id: searchParams.get("id") as string,
        }).then(() => {
          router.push("/root/dashboard");
        });

      }
    }
  }, [token]);
  return <Authloading />;
};

export default page;
