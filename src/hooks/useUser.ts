"use client";
import { signOut, useSession } from "next-auth/react";
import { useQueryData } from "./useQueryData";
import { getUser } from "@/api/user";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { TUserApiResponse } from "@/types/api.response";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";

export const useUser = () => {
    const router = useRouter();
    const { data: session, update } = useSession();
    const pathname = usePathname();
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const { setUser, setIsKYCVerified } = useUserStore();
    const [user, setUserState] = useState<TUserApiResponse>({
        created_at: "",
        email: "",
        firstname: "",
        id: "",
        is_verified: false,
        kyc_status: "",
        lastname: "",
        wallet_balance: "0.00"
    });
    const { data, isLoading, isError, refetch } = useQueryData(['user'], () => getUser(session?.user?.token as string),)
    useEffect(() => {
        if (isError) {
            // toast.error("Token is Expired, Please login again")
            // toast.promise(signOut({
            //     redirect: true,
            //     callbackUrl: "/auth/login"
            // }).then(() => {
            //     toast.success("Logged out successfully")
            //     router.push("/auth/login")
            // }).catch((error) => {
            //     toast.error("Failed to logout")
            //     router.push("/auth/login")
            // }), {
            //     loading: "Logging out...",
            //     success: "Logged out successfully",
            //     error: "Token is Expired, Please login again"
            // })

        }
    }, [isError])
    useEffect(() => {
        if (isLoading) {
            setIsLoadingUser(true);
        }
    }, [isLoading])

    useEffect(() => {
        refetch();
    }, [pathname])

    useEffect(() => {
        (async () => {
            if (data) {
                const name = (data as any).firstname + " " + (data as any).lastname
                const user = {
                    name: name,
                    id: (data as TUserApiResponse).id,
                    email: (data as TUserApiResponse).email,
                    verified: (data as TUserApiResponse).is_verified,
                }
                await update(user)
                setUserState(data as TUserApiResponse)
                setUser(user)
                setIsKYCVerified((data as TUserApiResponse).kyc_status === "approved")
                setIsLoadingUser(false);
            }
        })()
    }, [data])

    return { user, isLoading: isLoadingUser, isError, }
}