import {
  getWithdrawHistory,
  withdraw,
  withdrawBankTransfer,
  withdrawCrypto,
  withdrawCash,
  cancelWithdrawal,
  getWithdrawalTypes,
  createWithdrawal,
} from "@/api/withdraw";
import { getSystemSettings } from "@/api/systemSettings";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";
import {
  withdrawCashSchema,
  withdrawCryptoSchema,
  withdrawBankTransferSchema,
  withdrawSchemaType,
  withdrawSchema,
} from "@/schema/funds/withdraw.schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import {
  TWithdrawalTypeApiResponse,
  TWithdrawHistoryApiResponse,
} from "@/types/api.response";
import { useWatch } from "react-hook-form";
import { useSearchParams } from "next/navigation";

export const useWithdrawHistory = () => {
  const [withdrawHistory, setWithdrawHistory] = useState<
    TWithdrawHistoryApiResponse[]
  >([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    withdrawal_method: "all",
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
  const { data, isLoading, error } = useQueryData(
    ["withdraw-history", skip, limit, search, Object.values(params)],
    () => getWithdrawHistory(session?.user?.token as string, params),
    {
      enabled: !!session?.user?.token,
    },
  );
  useEffect(() => {
    if (data) {
      setWithdrawHistory((data as any)?.items as TWithdrawHistoryApiResponse[]);
    }
  }, [data]);
  return {
    withdrawHistory,
    isLoading,
    error,
    updateParams,
    params,
    total: (data as any)?.total_count,
  };
};

type WithdrawalMethod =
  | "bank_transfer"
  | "crypto"
  | "cash"
  | "custom"
  | "upi"
  | "all";

export const useWithdraw = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedWithdrawalType, setSelectedWithdrawalType] =
    useState<TWithdrawalTypeApiResponse | null>(null);
  const [withdrawalMethod, setWithdrawalMethod] =
    useState<WithdrawalMethod>("bank_transfer");
  const [details, setDetails] = useState<any>(null);
  const { data: withdrawalTypes } = useQueryData(
    ["withdrawal-types"],
    () => getWithdrawalTypes(session?.user?.token as string),
    {
      enabled: !!session?.user?.token,
    },
  );

  const { data: systemSettings } = useQueryData(
    ["system-settings"],
    () => getSystemSettings(session?.user?.token as string),
    { enabled: !!session?.user?.token },
  );
  const minWithdrawal = (systemSettings as any)?.min_withdrawal ?? 0;
  const maxWithdrawal = (systemSettings as any)?.max_withdrawal ?? 0;

  const onChangeData = (data: any) => {
    setDetails({ ...details, ...data });
  };

  const onChangeWithdrawalType = useCallback(
    (type: string) => {
      setSelectedWithdrawalType(
        (withdrawalTypes as TWithdrawalTypeApiResponse[]).find(
          (t) => t.group_name === type,
        ) as TWithdrawalTypeApiResponse,
      );
      setWithdrawalMethod(type as WithdrawalMethod);
    },
    [withdrawalTypes],
  );

  // const getApiFunction = useCallback((method: WithdrawalMethod) => {
  //     switch (method) {
  //         case "bank_transfer":
  //             return withdrawBankTransfer
  //         case "crypto":
  //             return withdrawCrypto
  //         case "cash":
  //             return withdrawCash
  //         default:
  //             return withdrawBankTransfer
  //     }
  // }, [])

  // const getSchema = useCallback((method: WithdrawalMethod): z.ZodSchema<withdrawSchemaType> => {
  //     switch (method) {
  //         case "bank_transfer":
  //             return withdrawBankTransferSchema
  //         case "crypto":
  //             return withdrawCryptoSchema
  //         case "cash":
  //             return withdrawCashSchema
  //         default:
  //             return withdrawBankTransferSchema
  //     }
  // }, [])

  // const api = getApiFunction(withdrawalMethod)
  // const schema = getSchema(withdrawalMethod)

  const { mutate, isPending, error } = useMutationData(
    ["withdraw"],
    (data: any) =>
      createWithdrawal(
        {
          ...data,
          withdrawal_type_id: selectedWithdrawalType?.id,
          withdrawal_name: selectedWithdrawalType?.group_name,
          details: details,
        },
        session?.user?.token as string,
      ),
    ["withdraw-history"],
    () => {
      toast.success("Withdrawal request submitted successfully");
      form.reset();
      router.push("/root/transactions?tab=withdraw");
    },
  );

  const { form, onFormSubmit, errors } = useZodFormV2(
    withdrawSchema,
    (data: any) => mutate(data),
    {
      currency: "",
      amount: 0,
    } as any,
  );

  const methods = useMemo(() => {
    if (!withdrawalTypes) return [];
    const data = Array.from(
      new Set(
        (withdrawalTypes as TWithdrawalTypeApiResponse[]).map(
          (t) => t.group_name,
        ),
      ),
    );
    onChangeWithdrawalType(data[0] as WithdrawalMethod);
    return data;
  }, [withdrawalTypes]);

  const availableCurrencies = useMemo(() => {
    if (!withdrawalMethod && !selectedWithdrawalType) return [];

    return [selectedWithdrawalType?.currency];
  }, [withdrawalMethod, selectedWithdrawalType]);

  return {
    form,
    onFormSubmit,
    errors,
    isPending,
    onChangeData,
    error,
    withdrawalMethod,
    setWithdrawalMethod,
    withdrawalTypes,
    currencies: availableCurrencies,
    methods,
    selectedWithdrawalType,
    details,
    onChangeWithdrawalType,
    minWithdrawal,
    maxWithdrawal,
  };
};

export const useCancelWithdrawal = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error, isSuccess } = useMutationData(
    ["cancel-withdrawal"],
    (withdrawalId: string) =>
      cancelWithdrawal(withdrawalId, session?.user?.token as string),
    ["withdraw-history"],
    () => {
      toast.success("Withdrawal cancelled successfully");
    },
  );
  return { mutate, isPending, error, isSuccess };
};
