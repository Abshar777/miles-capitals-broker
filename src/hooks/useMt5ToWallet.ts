import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";

import { useEffect, useState, useRef, useMemo } from "react";
import { CENT_MULTIPLIER } from "@/constants/mt5.const";
import {
  getMt5DepositHistory,
  getMt5ToWalletTransferByID,
  getMt5TransferToWalletHistory,
  mt5ToWalletTransfer,
} from "@/api/mt5";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import {
  TMT5DepositHistoryItemApiResponse,
  TMT5TransferToWalletHistoryItemApiResponse,
} from "@/types/api.response";

import { mt5ToWalletSchema } from "@/schema/funds/mt5ToWallet";
import { useGetMt5AccList, useGetMt5CredList } from "./useMt5";
import { useSearchParams } from "next/navigation";
import { queryClient } from "@/components/providers/react-query";

export const useMt5ToWalletTransfer = () => {
  const { data: session } = useSession();
  const { accounts: allAccounts } = useGetMt5AccList();
  const accounts = useMemo(
    () => allAccounts.filter((a) => a.account_type?.toUpperCase() === "LIVE"),
    [allAccounts],
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [credentialsId, setCredentialsId] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const selectedAccountRef = useRef<any>(null);
  const { credList } = useGetMt5CredList();
  const accountId = searchParams.get("accountId");
  const { mutate, isPending, error } = useMutationData(
    ["mt5ToWalletTransfer"],
    (data: any) =>
      mt5ToWalletTransfer(data, session?.user?.token as string, credentialsId),
    ["transfer"],
    async () => {
      toast.success("Transfer successful");
      form.reset({ amount: 0 });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mt5Balance"],                exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5CredList"],               exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5AccDetails"],             exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5AccList"],                exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5TransferToWalletHistory"],exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletBalance"],             exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletSummery"],             exact: false }),
        queryClient.invalidateQueries({ queryKey: ["client-counts"],             exact: false }),
        queryClient.invalidateQueries({ queryKey: ["all-transferHistory"],       exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5ToWalletTableHistory"],   exact: false }),
      ]);
      router.push(`/root/mt5`);
    },
  );
  const { form, onFormSubmit, errors, watch } = useZodFormV2(
    mt5ToWalletSchema,
    (data: any) => {
      const isCent = selectedAccountRef.current?.account_category === "cent";
      const payload = isCent
        ? { ...data, amount: data.amount * CENT_MULTIPLIER }
        : data;
      mutate(payload);
    },
    {
      currency: "",
      amount: 0,
      account_id: "",
    },
  );
  const watchedAccountId = watch("account_id");

  useEffect(() => {
    setDisabled(true);
    if (credList.length > 0 && accounts.length > 0) {
      const accid = watchedAccountId || accountId;
      const accountType = accounts.find(
        (account) => account.login.toString() == accid,
      );
      const id = credList.find(
        (cred) => cred?.type_account == accountType?.account_type,
      )?.id;
      setCredentialsId(id || "");
      setSelectedAccount(accountType);
      selectedAccountRef.current = accountType;
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [watchedAccountId, accountId, credList, accounts]);

  return {
    form,
    onFormSubmit,
    errors,
    isPending,
    error,
    disabled,
    accounts,
    selectedAccount,
  };
};

export const useMt5TransferToWalletHistory = () => {
  const [transferHistory, setTransferHistory] = useState<
    TMT5TransferToWalletHistoryItemApiResponse[]
  >([]);
  const { data: session } = useSession();
  const { data, isLoading, isError, isSuccess, error } = useQueryData(
    ["mt5TransferToWalletHistory"],
    () => getMt5TransferToWalletHistory(session?.user.token || ""),
  );
  useEffect(() => {
    if (data) {
      setTransferHistory(
        (data as any).transfers as TMT5TransferToWalletHistoryItemApiResponse[],
      );
    }
  }, [data]);
  return { data: transferHistory, isLoading, isError, isSuccess, error };
};

export const useMt5ToWalletTransferByID = (transferId: string) => {
  const { data: session } = useSession();
  const { data, isLoading, isError, isSuccess, error } = useQueryData(
    ["mt5ToWalletTransferByID", transferId],
    () => getMt5ToWalletTransferByID(session?.user.token || "", transferId),
  );
  return {
    data: data as TMT5TransferToWalletHistoryItemApiResponse,
    isLoading,
    isError,
    isSuccess,
    error,
  };
};
