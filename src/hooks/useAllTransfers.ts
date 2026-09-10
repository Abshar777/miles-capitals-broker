import { getWithdrawHistory, withdraw } from "@/api/withdraw";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";

import { useEffect, useState } from "react";
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
import { getAllTransfers } from "@/api/transfers";
import { IAllTransfersData } from "@/types/IAllTransfers";

export const useAllTransferHistory = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    mt5_login: "",
    transfer_type: "all",
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
    ["all-transferHistory", skip, limit, search, Object.values(params)],
    () =>
      getAllTransfers(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
  );

  return {
    data: (data as IAllTransfersData)?.transfers || [],
    isLoading,
    isError,
    isSuccess,
    error,
    params,
    updateParams,
    total: (data as IAllTransfersData)?.total_count || 0,
  };
};
