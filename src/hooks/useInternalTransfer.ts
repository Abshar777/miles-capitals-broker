import { cancelWithdrawal, getWithdrawHistory, withdraw } from "@/api/withdraw";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";

import { useEffect, useState } from "react";
import { getMt5DepositHistory, getUserByEmail, transferFunds } from "@/api/mt5";
import {
  cancelWalletTransfer,
  walletToWalletTransfer,
  walletTransferHistory,
} from "@/api/walletTransfer";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { TWalletTransferHistory } from "@/types/api.response";
import { internalTransferSchema } from "@/schema/funds/internalTransferSchema";
import { queryClient } from "@/components/providers/react-query";
import { useSearchParams } from "next/navigation";

export const useWalletToWalletTransfer = () => {
  const { data: session } = useSession();

  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(true);

  const { mutate, isPending, error } = useMutationData(
    ["inetnalTransfer"],
    (data: any) => walletToWalletTransfer(data, session?.user?.token as string),
    ["walletToWalletTransfer"],
    async () => {
      toast.success("Transfer successful");
      form.reset({ amount: 0, destination_login: "" });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["walletBalance"],       exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletSummery"],       exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletToWalletTransfer"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["all-transferHistory"], exact: false }),
        queryClient.invalidateQueries({ queryKey: ["client-counts"],       exact: false }),
      ]);
      router.push(`/root/funds`);
    },
  );

  const { form, onFormSubmit: _onFormSubmit, errors, watch } = useZodFormV2(
    internalTransferSchema,
    (data: any) => {
      mutate(data);
    },
    {
      currency: "",
      amount: 0,
      destination_login: "",
    },
  );

  const destinationEmail = watch("destination_login");

  const {
    data: userEmailData,
    isLoading: userIdLoading,
    isError: userIdError,
    isSuccess: userIdSuccess,
    error: userIdErr,
  } = useQueryData(
    ["userByEmail", destinationEmail],
    () => getUserByEmail(session?.user?.token as string, destinationEmail),
    {
      enabled: destinationEmail?.trim() !== "" && destinationEmail?.includes("@"),
    },
  );

  useEffect(() => {
    if (userEmailData) {
      setDisabled(false);
    }
    if (userIdError) {
      setDisabled(true);
    }
  }, [destinationEmail, userEmailData, userIdError]);

  return {
    form,
    onFormSubmit: _onFormSubmit,
    errors,
    isPending,
    error,
    disabled,
    userIdData: userEmailData,
    userIdLoading,
    userIdError,
    userIdSuccess,
  };
};

export const useWalletTransferHistory = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    currency: "all",
    date_from: "",
    date_to: "",
    status: "all",
  });

  const updateParams = (key: keyof typeof params, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    if (key == "date_from" || key == "date_to") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, value);
      router.push(`?${newParams.toString()}`);
    }
  };
  const { data, isLoading, isError, isSuccess, error } = useQueryData(
    ["walletToWalletTransfer", skip, limit, search, Object.values(params)],
    () =>
      walletTransferHistory(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
  );

  return {
    data: (data as any)?.items || ([] as TWalletTransferHistory[]),
    isLoading,
    isError,
    isSuccess,
    error,
    params,
    updateParams,
    total: (data as any)?.total_count || 0,
  };
};

export const useCancelWalletTransfer = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error, isSuccess } = useMutationData(
    ["cancel-wallet-transfer"],
    (transferId: string) =>
      cancelWalletTransfer(session?.user?.token as string, transferId),
    ["walletToWalletTransfer"],
    () => {
      toast.success("Wallet transfer cancelled successfully");
    },
  );
  return { mutate, isPending, error, isSuccess };
};
