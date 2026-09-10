import { useQueryData } from "./useQueryData";
import { useClientCounts } from "./useClientCounts";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutationData } from "./useMutation";
import { toast } from "sonner";
import {
  exportIbWalletCommissions,
  getIbWalletBalance,
  getIbWalletCommissions,
  getIbWalletTransactions,
  transferToMain,
} from "@/api/ib-wallet";
import {
  TIBWalletBalanceApiResponse,
  TIBWalletCommissionApiResponse,
  TIBWalletTransactionApiResponse,
} from "@/types/IIB";
import { useZodFormV2 } from "./useZodForm";
import { transferToMainSchema } from "@/schema/ib/apply.schema";
import { useEffect, useRef, useState } from "react";
import { queryClient } from "@/components/providers/react-query";

export const useIbWalletBalance = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading, error } = useQueryData(
    ["ib-wallet-balance"],
    () => getIbWalletBalance(session?.user.token || ""),
    {
      enabled: !!session?.user.token,
      staleTime: 60_000,
      refetchInterval: 60_000,
    },
  );
  return { data: data as TIBWalletBalanceApiResponse, isLoading, error };
};

export const useIbCommissionCount = () => {
  const { ibCommissions: count } = useClientCounts();
  return { count };
};

export const useIbWalletTransactions = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [params, setParams] = useState({
    transaction_type: "all",
    date_from: "",
    date_to: "",
  });

  const updateParams = (key: keyof typeof params, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    if (key == "date_from" || key == "date_to") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, value);
      router.push(`?${newParams.toString()}`);
    }
  };
  const { data, isLoading, error } = useQueryData(
    [
      "ib-wallet-transactions",
      Object.values(params).join("-"),
      skip,
      limit,
      search,
    ],
    () =>
      getIbWalletTransactions(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
    {
      enabled: !!session?.user.token,
    },
  );
  return {
    data: (data as TIBWalletTransactionApiResponse)?.transactions || [],
    isLoading,
    error,
    params,
    updateParams,
    total: (data as TIBWalletTransactionApiResponse)?.total_count || 0,
  };
};

export const useIbWalletCommissions = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [params, setParams] = useState({
    level: "",
    symbol: "",
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
  const { data, isLoading, error } = useQueryData(
    [
      "ib-wallet-commissions",
      Object.values(params).join("-"),
      skip,
      limit,
      search,
    ],
    () =>
      getIbWalletCommissions(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
    {
      enabled: !!session?.user.token,
    },
  );
  return {
    data: (data as TIBWalletCommissionApiResponse)?.commissions || [],
    isLoading,
    error,
    params,
    updateParams,
    total: (data as TIBWalletCommissionApiResponse)?.total_count || 0,
  };
};

export const useExportIbCommissions = () => {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (params: Record<string, string>) => {
    setIsExporting(true);
    try {
      const XLSX = await import("xlsx");
      const res = await exportIbWalletCommissions(session?.user.token || "", params);
      const commissions: any[] = res?.commissions || [];

      if (commissions.length === 0) {
        const { toast } = await import("sonner");
        toast.info("No commissions to export for the selected filters.");
        return;
      }

      const rows = commissions.map((c) => ({
        "Trade ID": c.trade_id ?? "",
        "MT5 Login": c.mt5_login ?? "",
        "Trader Email": c.trader_email ?? "",
        "Symbol": c.trade_symbol ?? "",
        "Type": c.trade_type ?? "",
        "Volume (Lots)": c.volume_lots ?? 0,
        "Reward Amount": c.amount ?? 0,
        "Currency": c.currency ?? "USD",
        "Level": c.level ?? "",
        "Status": c.status ?? "",
        "Date": c.created_at
          ? new Date(c.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Commissions");
      const fileName = `ib-commissions-${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);

      const { toast } = await import("sonner");
      toast.success(`Exported ${commissions.length} commission${commissions.length !== 1 ? "s" : ""} to ${fileName}`);
    } catch (err) {
      const { toast } = await import("sonner");
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToExcel, isExporting };
};

export const useTransferToMain = (onSuccess: () => void = () => {}) => {
  const ref = useRef<HTMLButtonElement | any>(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate, isPending, isSuccess, ...rest } = useMutationData(
    ["ib-wallet-transfer-to-main"],
    (data: { amount: number }) =>
      transferToMain(session?.user.token || "", data),
    ["ib-wallet-balance"],
    async () => {
      await queryClient.invalidateQueries({
        queryKey: ["ib-wallet-transactions"],
        exact:false
      });
      if (ref.current) ref.current?.click();
      onSuccess();
    },
  );

  const {
    register,
    formState: { errors },
    onFormSubmit,
    form,
    watch,
  } = useZodFormV2(transferToMainSchema, mutate, {
    amount: 0,
  });

  const { data: ibWalletBalance } = useIbWalletBalance();

  //   useEffect(() => {
  //     const amount = watch("amount");
  //     if (amount > ibWalletBalance?.available_balance) {
  //       form.setError("amount", {
  //         message: "Amount is greater than available balance",
  //       });
  //       toast.error("Amount is greater than available balance");
  //     }
  //   }, [watch("amount")]);

  const maxOnclick = () => {
    form.setValue("amount", ibWalletBalance?.available_balance || 0);
  };

  return {
    register,
    errors,
    onFormSubmit,
    isPending,
    maxOnclick,
    form,
    rest,
    balance: ibWalletBalance?.available_balance || 0,
    ref,
  };
};
