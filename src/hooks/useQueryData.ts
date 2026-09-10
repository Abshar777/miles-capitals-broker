import {
  Enabled,
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const useQueryData = (
  queryKey: QueryKey,
  queryFn: QueryFunction,
  options?: Partial<UseQueryOptions>,
) => {
  const { data, isPending, isFetched, refetch, isFetching, ...rest } = useQuery(
    {
      queryKey,
      queryFn,
      refetchInterval: options?.refetchInterval,

      ...options,
    },
  );
  useEffect(() => {
    const err = rest.error as AxiosError;
    if (err) {
      console.log(err)
      // toast.error(error.message);
      if (
        (err?.response?.data as any)?.error?.message ==
          "Invalid authentication credentials" ||
        (err?.response?.data as any)?.error?.message == "Not authenticated" ||
        (err?.response?.data as any)?.error?.message == "Invalid token" 
      ) {
        toast.error("token is expired");
        toast.promise(
          signOut({
            redirect: true,
            callbackUrl: "/auth/login",
          })
            .then(() => {
              toast.success("Logged out successfully");
            })
            .catch((error) => {
              toast.error("Failed to logout");
            }),
          {
            loading: "Logging out...",
            success: "Logged out successfully",
            error: "Failed to logout",
          },
        );
      }
    }
  }, [rest.error]);
  return { data, isPending, isFetched, refetch, isFetching, ...rest };
};
