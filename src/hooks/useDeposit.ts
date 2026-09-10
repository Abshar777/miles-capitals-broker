import { useMutation } from "@tanstack/react-query";
import { deleteDeposit, deposit, getDepositeHistory } from "@/api/deposit";
import { useMutationData } from "./useMutation";
import { toast } from "sonner";
import { useZodFormV2 } from "./useZodForm";
import {
  depositeSchema,
  depositeSchemaType,
} from "@/schema/funds/deposite.schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import {
  currencyDescriptions,
  currencyImages,
  fromCurrencies,
  paymentMethods,
  TCurrency,
} from "@/constants/curency";
import { fetchExchangeRates } from "@/api/utils";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IPaymentOption,
  TDepositHistoryApiResponse,
} from "@/types/api.response";
import { getPrices } from "@/api/prices";
import {
  useGetAvailableCurrencies,
  useGetPaymentOptions,
} from "./usePaymentOptions";
import { useCreateCoinsbayIntent } from "./useCoinsbay";
import { queryClient } from "@/components/providers/react-query";

export const useDeposit = () => {
  const [err, seterr] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [paymentMethodAvl, setPaymentMethodAvl] = useState<
    (IPaymentOption & {
      label: string;
      value: string;
      fromId: string;
      iconImage: string;
      description: string;
      disabled: boolean;
      currency: string;
      

    })[]
  >([]);
  const [currentUsdRate, setCurrentUsdRate] = useState<number>(0);
  const [currencies, setCurrencies] = useState<TCurrency[]>([
    {
      id: "0",
      label: "loading",
      value: "loading",
      iconImage: currencyImages["AED"],
      description: currencyDescriptions["AED"],
      disabled: true,
      badgeLabel: "Loading",
    },
  ]);
  const [agoUsdRate, setAgoUsdRate] = useState<number>(0);
  const [commissionFeeUsd, setCommissionFeeUsd] = useState<number>(0);
  const [commissionFeeBase, setCommissionFeeBase] = useState<number>(0);
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{
    id: string;
    label: string;
    value: string;
    fromId: string;
    iconImage: string;
    description: string;
    disabled: boolean;
    currency: string;
    provider: string;
    image_url?: string;
    commission_percent?: number;
    commission_start_amount?: number;
  } | null>(null);

  const { mutate, isPending, isError, isSuccess, error } = useMutationData(
    ["deposit"],
    (data: any) => deposit(data, session?.user.token || ""),
    ["deposit"],
    async () => {
      toast.success("Deposit successful");
      form.resetField("amount");
      form.resetField("receiveAmount");
      form.resetField("file");
      form.resetField("paymentMethod");
      setSelectedPaymentMethod(null);
      await queryClient.invalidateQueries({
        queryKey: ["deposit"],
        exact: false,
      });
      await queryClient.refetchQueries({
        queryKey: ["deposit"],
        exact: false,
      });
    },
  );

  const handleSubmit = (data: any) => {
    if (selectedPaymentMethod?.provider === "coinsbuy") {
      // Only pass amount — intent flow; no Deposit row created until payment confirmed
      createCoinsbayIntentMutation({ amount: data.receiveAmount || data.amount });
    } else {
      if (
        ((selectedPaymentMethod as any)?.parameters?.isImageRequire=="true" &&
        !data.file)
      ) {
        form.setError("file", {
          message: "Please upload proof of deposit",
        });
        
      }
      else mutate(data);
    }
  };
  const { form, formState, errors, onFormSubmit, watch, reset } = useZodFormV2(
    depositeSchema,
    handleSubmit,
    {
      amount: 0,
      to: "",
      from: "",
      paymentMethod: "",
      payment_mode: "",
      payment_option_id: "",
      receiveAmount: 0,
      file: undefined,
    },
  );
  const {
    mutate: createCoinsbayIntentMutation,
    isPending: createCoinsbayIntentPending,
  } = useCreateCoinsbayIntent(() => {
    // Reset form fields after intent created and checkout window opened
    setSelectedPaymentMethod(null);
    form.setValue("paymentMethod", "");
    form.setValue("payment_mode", "");
    form.setValue("payment_option_id", "");
    form.setValue("amount", 0);
    form.setValue("receiveAmount", 0);
  });

  const paymentMode = form.watch("payment_mode");

  const {
    currencies: availableCurrencies,
    isLoading: availableCurrenciesLoading,
  } = useGetAvailableCurrencies();
  const {
    paymentOptions,
    isLoading: paymentOptionsLoading,
    error: paymentOptionsError,
    isRefetching: paymentOptionsRefetching,
  } = useGetPaymentOptions(form.watch("from"));

  useEffect(() => {
    if (paymentOptions) {
      setPaymentMethodAvl(
        paymentOptions.map((option: any) => ({
          ...option,
          label: option.group_name,
          value: option.id.toString(),
          fromId: option.currency,
          iconImage: "/logo.png",
          description: option.type,
          currency: option.currency,
          commission_percent: option.commission_percent,
          commission_start_amount: option.commission_start_amount,
        })),
      );
      setSelectedPaymentMethod(null);
      form.setValue("paymentMethod", "");
      form.setValue("payment_mode", "");
      form.setValue("payment_option_id", "");
      form.setValue("amount", 0);
      form.setValue("receiveAmount", 0);
    }
  }, [paymentOptions]);

  useEffect(() => {
    if (availableCurrencies) {
      setCurrencies(
        availableCurrencies.map((e, idx) => ({
          id: idx.toString(),
          label: e.toUpperCase(),
          value: e,
          iconImage:
            currencyImages[e as keyof typeof currencyImages] ||
            "/svgs/currency/unknown.png",
          description:
            currencyDescriptions[e as keyof typeof currencyDescriptions] ||
            "Unknown Currency",
          disabled: false,
          badgeLabel: "Available",
        })),
      );
    }
  }, [availableCurrencies]);

  const {
    data: pricesData,
    isLoading: usdLoading,
    isRefetching: usdRefetching,
    refetch: usdRefetch,
    dataUpdatedAt: usdDataUpdatedAt,
  } = useQueryData(["rate"], () => getPrices(session?.user.token || ""));

  // Commission comes from the selected payment option (per-option setting)
  const commissionPercent     = (selectedPaymentMethod as any)?.commission_percent      ?? 0;
  const commissionStartAmount = (selectedPaymentMethod as any)?.commission_start_amount ?? 0;

  useEffect(() => {
    if (pricesData) {
      const pricesFromData = (pricesData as any)?.prices || {};
      setPrices(pricesFromData);

      if (form.watch("from")) {
        const currencyKey = form.watch("from").toLowerCase();
        setCurrentUsdRate(pricesFromData[currencyKey] || 0);
      }
    }
  }, [pricesData, form.watch("from")]);

  useEffect(() => {
    if (!usdDataUpdatedAt) return;

    const updateAgo = () => {
      const diff = Date.now() - usdDataUpdatedAt;
      const minutes = Math.floor(diff / 60000);
      setAgoUsdRate(minutes);
    };

    updateAgo();

    const interval = setInterval(updateAgo, 60000);

    return () => clearInterval(interval);
  }, [usdDataUpdatedAt]);

  useEffect(() => {
    const paymentMethod = watch("paymentMethod");
    if (paymentMethod) {
      const selected =
        paymentMethodAvl.find((p) => p.value === paymentMethod) || null;
      form.setValue("payment_mode", selected?.type || "");
      form.setValue("payment_option_id", selected?.id || "");

      setSelectedPaymentMethod(selected);

      if (selected?.currency && prices) {
        const currencyKey = selected.currency.toLowerCase();
        setCurrentUsdRate(prices[currencyKey] || 0);
      }
    }
  }, [watch("paymentMethod"), prices]);

  useEffect(() => {
    const amount = watch("amount");

    if (form.watch("from") && prices) {
      // Gross receive amount in USD (before commission)
      const grossUsd = calculateReceiveAmount(amount, form.watch("from"), prices);

      // Calculate commission
      let feeUsd  = 0;
      let feeBase = 0;
      if (commissionPercent > 0 && grossUsd >= commissionStartAmount) {
        feeUsd  = Number((grossUsd * commissionPercent / 100).toFixed(6));
        // Convert fee back to the base/from currency: fee_base = fee_usd * usdRate
        // currentUsdRate = how many from-currency per 1 USD (e.g. 3.67 AED per USD)
        feeBase = Number((feeUsd * currentUsdRate).toFixed(2));
      }
      const netUsd = Number((grossUsd - feeUsd).toFixed(6));

      setCommissionFeeUsd(feeUsd);
      setCommissionFeeBase(feeBase);
      form.setValue("receiveAmount", netUsd, { shouldValidate: (amount ?? 0) > 0 });
    }
  }, [watch("amount"), form.watch("from"), prices, form, commissionPercent, commissionStartAmount, currentUsdRate]);

  const calculateReceiveAmount = useCallback(
    (
      amount: number,
      fromCurrency: string,
      exchangeRates: Record<string, number>,
      toCurrency: string = "USD",
    ): number => {
      if (!amount || !fromCurrency || !toCurrency || !exchangeRates) return 0;

      const toRate = Number(exchangeRates[fromCurrency.toLowerCase()]);
      const fromRate = Number(exchangeRates[toCurrency.toLowerCase()]);
      console.log(fromRate, toRate, "fromRate,toRate", amount);
      if (!fromRate || !toRate) return 0;

      const amountInUSD = amount * fromRate;

      const finalAmount = amountInUSD / toRate;

      return Number(finalAmount.toFixed(6));
    },
    [],
  );

  const onEnterAmountRecive = useCallback(
    (amount: number) => {
      console.log(amount, "amount");
      if (selectedPaymentMethod?.currency && prices) {
        const convertedAmount = calculateReceiveAmount(
          amount,
          selectedPaymentMethod.currency,
          prices,
        );
        console.log(convertedAmount, "convertedAmount");
        form.setValue("receiveAmount", convertedAmount, { shouldValidate: (amount ?? 0) > 0 });
      }
    },
    [selectedPaymentMethod?.currency, prices, calculateReceiveAmount, form],
  );

  useEffect(() => {
    if (isSuccess) seterr(null);
    Object.values(errors).map(
      (e: any, i) => i == 0 && seterr(e?.message as string),
    );
    if (isError) {
      const data = (error as unknown as AxiosError).response?.data as {
        message?: string;
      };
      seterr(data?.message as string);
    }
  }, [errors, isSuccess, isError, error]);

  return {
    form,
    formState,
    errors,
    onFormSubmit,
    mutate,
    isPending: isPending || createCoinsbayIntentPending,
    isError,
    isSuccess,
    paymentMode,
    err,
    paymentMethodAvl,
    selectedPaymentMethod,
    onEnterAmountRecive,
    currentUsdRate,
    agoUsdRate,
    usdRefetch,
    usdRefetching,
    usdLoading,
    calculateReceiveAmount,
    prices,
    currencies,
    availableCurrenciesLoading,
    paymentOptionsRefetching,
    paymentOptionsLoading,
    // Commission
    commissionPercent,
    commissionStartAmount,
    commissionFeeUsd,
    commissionFeeBase,
  };
};

export const useDepositeHistory = () => {
  const [depositHistory, setDepositHistory] = useState<
    TDepositHistoryApiResponse[]
  >([]);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const skip = Number(searchParams.get("skip")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const router = useRouter();
  const [params, setParams] = useState({
    payment_mode: "",
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
  const { data, isLoading, isError, isSuccess, error, refetch } = useQueryData(
    ["deposit", skip, limit, search, Object.values(params)],
    () =>
      getDepositeHistory(session?.user.token || "", {
        skip,
        limit,
        search,
        ...params,
      }),
    {
      enabled: !!session?.user.token,
    },
  );
  useEffect(() => {
    if (data) {
      setDepositHistory(
        (data as { items: TDepositHistoryApiResponse[] }).items,
      );
    }
  }, [data]);
  return {
    depositHistory,
    isLoading,
    isError,
    isSuccess,
    error,
    params,
    updateParams,
    total: (data as { total_count: number })?.total_count,
  };
};

export const useDeleteDeposit = () => {
  const [id, setId] = useState("");
  const { data: session } = useSession();
  const { mutate, isPending, isSuccess, isError, error } = useMutationData(
    ["deleteDeposit"],
    () => deleteDeposit(id, session?.user.token || ""),
    ["deposit"],
    () => {
      toast.info("Deposit deleted");
    },
  );
  return { mutate, isPending, isSuccess, isError, error, setId };
};
