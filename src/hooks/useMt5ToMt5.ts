import { getWithdrawHistory, withdraw } from "@/api/withdraw";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";

import { useEffect, useState, useMemo } from "react";
import {
  getMt5DepositHistory,
  mT5ToMT5Transfer,
  mT5ToMt5TransferHistory,
  transferFunds,
} from "@/api/mt5";
import { transferSchema } from "@/schema/funds/transfer.schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { queryClient } from "@/components/providers/react-query";
import { trasferHistory } from "@/api/wallet";
import { TMT5ToMT5TransferHistoryItemApiResponse } from "@/types/api.response";
import { useGetMt5AccList, useGetMt5CredList } from "./useMt5";
import { mt5ToMt5TransferSchema } from "@/schema/funds/mt5ToMt5Schema";

export const useMT5ToMT5Transfer = () => {
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
  const { credList } = useGetMt5CredList();
  const accountId = searchParams.get("accountId");
  const [acountOptions, setAcountOptions] = useState<any[]>([
    {
      label: "Loading...",
      value: "",
      disabled: true,
      iconImage: "/svgs/currency/usd.svg",
      badgeLabel: "Not Available",
    },
  ]);

  const { mutate, isPending, error } = useMutationData(
    ["mT5ToMt5Transfer"],
    (data: any) =>
      mT5ToMT5Transfer(data, session?.user?.token as string, credentialsId),
    ["mT5ToMt5TransferHistory"],
    async () => {
      toast.success("Transfer successful");
      await queryClient.invalidateQueries({ queryKey: ["mt5Balance"],exact:false });
      await queryClient.refetchQueries({ queryKey: ["mt5Balance"],exact:false });
      await queryClient.invalidateQueries({ queryKey: ["mt5AccList"],exact:false });
      await queryClient.refetchQueries({ queryKey: ["mt5AccList"],exact:false });
      await queryClient.invalidateQueries({ queryKey: ["mt5AccDetails"],exact:false });
      form.reset();
    },
  );
  const { form, onFormSubmit, errors, watch } = useZodFormV2(
    mt5ToMt5TransferSchema,
    (data: any) => mutate(data),
    {
      destination_login: "",
      source_login: "",
      amount: 0,
      currency: "",
    },
  );

  const watchedSourceLogin = watch("source_login");

  useEffect(() => {
    setDisabled(true);
    if (credList.length > 0 && accounts.length > 0) {
      const accid = watchedSourceLogin || accountId;
      const accountType = accounts.find(
        (account) => account.login.toString() == accid,
      );
      const id = credList.find(
        (cred) => cred?.type_account == accountType?.account_type,
      )?.id;
      setCredentialsId(id || "");
      setSelectedAccount(accountType);
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [watchedSourceLogin, accountId, credList, accounts]);

  return {
    form,
    onFormSubmit,
    errors,
    accounts,
    isPending,
    error,
    disabled,
    selectedAccount,
    acountOptions,
  };
};

export const useMTransferHistory = () => {
  const [transferHistory, setTransferHistory] = useState<
    TMT5ToMT5TransferHistoryItemApiResponse[]
  >([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    login: "",
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
    ["mT5ToMt5TransferHistory", skip, limit, search, Object.values(params)],
    () => mT5ToMt5TransferHistory(session?.user.token || "", {skip,limit,search,...params}),
  );
  useEffect(() => {
    if (data) {
      setTransferHistory(
        (data as any).transfers as TMT5ToMT5TransferHistoryItemApiResponse[],
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
