import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { TTransferHistoryItemApiResponse, TWalletBalanceApiResponse, TWalletSummeryApiResponse } from "@/types/api.response";
import { walletBalance, walletSummery, trasferHistory, getAllTransactions } from "@/api/wallet";

export type TAllTransaction = {
    id: string;
    type: "deposit" | "withdrawal" | "wallet_to_mt5" | "internal_transfer" | "mt5_to_wallet";
    amount: number;
    currency: string;
    status: string;
    direction?: "sent" | "received";
    description?: string;
    created_at: string | null;
};


export const useWalletBalance = () => {
    const { data: session } = useSession();
    const { data, isLoading, isError, isSuccess, error } = useQueryData(
        ['walletBalance'],
        () => walletBalance(session?.user.token || ""),
    );
    return { data: data as TWalletBalanceApiResponse | null, isLoading, isError, isSuccess, error };
}

export const useWalletSummery = () => {
    const { data: session } = useSession();
    const { data, isLoading, isError, isSuccess, error } = useQueryData(
        ['walletSummery'],
        () => walletSummery(session?.user.token || ""),
    );
    return { data: data as TWalletSummeryApiResponse | null, isLoading, isError, isSuccess, error };
}

export const useTransactionHistory = () => {
    const { data: session } = useSession();
    const { data, isLoading, isError, isSuccess, error } = useQueryData(
        ['transactionHistory'],
        () => trasferHistory(session?.user.token || ""),
    );
    return {
        data: ((data as any)?.transactions ?? []) as TTransferHistoryItemApiResponse[],
        isLoading,
        isError,
        isSuccess,
        error,
    };
}

export const useAllTransactionHistory = (limit = 20) => {
    const { data: session } = useSession();
    const { data, isLoading, isError, isSuccess, error } = useQueryData(
        ['allTransactionHistory', limit],
        () => getAllTransactions(session?.user.token || "", limit),
    );
    return {
        data: ((data as any)?.transactions ?? []) as TAllTransaction[],
        total: ((data as any)?.total_count ?? 0) as number,
        isLoading,
        isError,
        isSuccess,
        error,
    };
}
