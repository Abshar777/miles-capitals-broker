import { getWithdrawHistory, withdraw } from "@/api/withdraw";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";

import { useEffect, useState, useMemo } from "react";
import { getMt5DepositHistory, transferFunds } from "@/api/mt5";
import { transferSchema } from "@/schema/funds/transfer.schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { queryClient } from "@/components/providers/react-query";
import { trasferHistory } from "@/api/wallet";
import {
  TMT5DepositHistoryApiResponse,
  TMT5DepositHistoryItemApiResponse,
} from "@/types/api.response";
import { useGetMt5AccList, useGetMt5CredList } from "./useMt5";

export const useTransfer = () => {
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
  const { credList } = useGetMt5CredList();
  const accountId = searchParams.get("accountId");
  const { mutate, isPending, error } = useMutationData(
    ["transfer"],
    (data: any) =>
      transferFunds(data, session?.user?.token as string, credentialsId),
    ["transfer"],
    async () => {
      toast.success("Transfer successful");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mt5Balance"],     exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5CredList"],    exact: false }),
        queryClient.invalidateQueries({ queryKey: ["mt5AccDetails"],  exact: false }),
        queryClient.invalidateQueries({ queryKey: ["transferHistory"],exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletBalance"],  exact: false }),
        queryClient.invalidateQueries({ queryKey: ["walletSummery"],  exact: false }),
        queryClient.invalidateQueries({ queryKey: ["client-counts"],  exact: false }),
        queryClient.invalidateQueries({ queryKey: ["all-transferHistory"], exact: false }),
      ]);
      router.push(`/root/mt5`);
    },
  );
  const { form, onFormSubmit, errors, watch } = useZodFormV2(
    transferSchema,
    (data: any) => mutate(data),
    {
      currency: "",
      amount: 0,
      account_id: (accountId as string) || "",
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
      setDisabled(false);
    }
    if (credList.length == 0 || accounts.length == 0) {
      setDisabled(true);
    }
  }, [watchedAccountId, accountId, credList, accounts]);

  return { form, onFormSubmit, errors, accounts, isPending, error, disabled };
};

export const useTransferHistory = () => {
  const [transferHistory, setTransferHistory] = useState<
    TMT5DepositHistoryItemApiResponse[]
  >([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    mt5_login: "",
    currency: "all",
    date_from: "",
    date_to: "",
    status_filter: "all",
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
    ["transferHistory", skip, limit, search, Object.values(params)],
    () =>
      getMt5DepositHistory(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
  );
  useEffect(() => {
    if (data) {
      setTransferHistory(
        (data as any)?.deposits as TMT5DepositHistoryItemApiResponse[],
      );
    }
  }, [data]);
  return {
    data: transferHistory,
    isLoading,
    isError,
    isSuccess,
    error,
    params,
    updateParams,
    total: (data as any)?.total_count || 0,
  };
};
