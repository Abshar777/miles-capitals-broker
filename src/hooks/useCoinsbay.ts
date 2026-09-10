import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  createCoinsbayIntent,
  getCoinsbayIntentStatus,
  getCoinsbayWallets,
  getCoinsbayDepositStatus,
} from "@/api/coinsbay";
import { useQueryData } from "./useQueryData";
import { useMutationData } from "./useMutation";
import { useCoinsbayUiStore } from "@/store/coinsBayUiStore";
import {
  TCoinsbayIntentStatusResponse,
  TCoinsbayDepositStatusApiResponse,
} from "@/types/ICoinsBay";
import { queryClient } from "@/components/providers/react-query";

// ── Intent-based hooks (current flow) ────────────────────────────────────────

/**
 * Creates a PaymentIntent on submit.
 * No Deposit row is created until CoinsBuy confirms payment.
 */
export const useCreateCoinsbayIntent = (onSuccess: () => void = () => {}) => {
  const { data: session } = useSession();
  const { setValue } = useCoinsbayUiStore();

  const { mutate, isPending, isError, isSuccess, error } = useMutationData(
    ["createCoinsbayIntent"],
    (data: { amount: number }) =>
      createCoinsbayIntent(session?.user?.token as string, data),
    ["coinsbayIntents"],
    (data) => {
      // Store intent_id so the status poller knows what to watch
      setValue(data.intent_id);
      // Open CoinsBuy checkout in a new tab
      window.open(data.checkout_url, "_blank");
      toast.success("Payment window opened — complete your USDT transfer");
      onSuccess();
    },
  );

  return { mutate, isPending, isError, isSuccess, error };
};

/**
 * Polls intent status every 10 seconds.
 * When status transitions to "paid", deposit_id is set and balance will be credited.
 */
export const useCoinsbayIntentStatus = (intentId: string) => {
  const { data: session } = useSession();

  const { data, isLoading, isError, refetch } = useQueryData(
    ["coinsbayIntentStatus", intentId],
    () => getCoinsbayIntentStatus(session?.user?.token as string, intentId),
    {
      enabled: !!session?.user?.token && !!intentId,
      refetchInterval: (query) => {
        // Stop polling once the intent reaches a terminal state
        const status = (query.state.data as TCoinsbayIntentStatusResponse)?.status;
        if (status === "paid" || status === "expired" || status === "cancelled") {
          // Invalidate deposit history so the new deposit appears
          if (status === "paid") {
            queryClient.invalidateQueries({ queryKey: ["deposit"], exact: false });
          }
          return false;
        }
        return 10_000; // poll every 10 seconds while pending
      },
    },
  );

  return {
    intentStatus: data as TCoinsbayIntentStatusResponse | undefined,
    isLoading,
    isError,
    refetch,
  };
};

// ── Legacy hooks (kept for backwards compat) ──────────────────────────────────

/** @deprecated Use useCreateCoinsbayIntent instead */
export const useCreateCoinsbayDeposit = (onSuccess: () => void = () => {}) => {
  const { data: session } = useSession();
  const { setValue } = useCoinsbayUiStore();

  const { mutate, isPending, isError, isSuccess, error } = useMutationData(
    ["createCoinsbayDeposit"],
    (data: any) =>
      import("@/api/coinsbay").then((m) =>
        m.createCoinsbayDeposit(session?.user?.token as string, data),
      ),
    ["coinsbayDeposits"],
    (data) => {
      setValue(data.deposit_id);
      window.open(data.payment_url, "_blank");
      toast.success("Coinsbay deposit created successfully");
      onSuccess();
    },
  );

  return { mutate, isPending, isError, isSuccess, error };
};

/** @deprecated Use useCoinsbayIntentStatus instead */
export const useCoinsbayDepositStatus = (depositId: string) => {
  const { data: session } = useSession();

  const { data, isLoading, isError, refetch } = useQueryData(
    ["coinsbayDepositStatus", depositId],
    () => getCoinsbayDepositStatus(session?.user?.token as string, depositId),
    {
      enabled: !!session?.user?.token && !!depositId,
      refetchInterval: 60_000,
    },
  );

  return {
    depositStatus: data as TCoinsbayDepositStatusApiResponse,
    isLoading,
    isError,
    refetch,
  };
};

// ── Shared ────────────────────────────────────────────────────────────────────

export const useCoinsbayWallets = () => {
  const { data: session } = useSession();

  const { data, isLoading, isError, refetch } = useQueryData(
    ["coinsbayWallets"],
    () => getCoinsbayWallets(session?.user?.token as string),
    { enabled: !!session?.user?.token },
  );

  return {
    wallets: (data as any)?.wallets || [],
    isLoading,
    isError,
    refetch,
  };
};
