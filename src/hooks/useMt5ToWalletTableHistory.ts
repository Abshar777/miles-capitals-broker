import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { getMt5ToWalletHistory } from "@/api/transfers";
import { IAllTransfersData } from "@/types/IAllTransfers";

export const useMt5ToWalletTableHistory = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();

  const [params, setParams] = useState({
    mt5_login: "",
    status_filter: "all",
    date_from: "",
    date_to: "",
  });

  const updateParams = (key: keyof typeof params, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    if (key === "date_from" || key === "date_to") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, value);
      router.push(`?${newParams.toString()}`);
    }
  };

  const { data, isLoading, isError, isSuccess, error } = useQueryData(
    ["mt5ToWalletTableHistory", skip, limit, search, Object.values(params)],
    () =>
      getMt5ToWalletHistory(session?.user.token || "", {
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
