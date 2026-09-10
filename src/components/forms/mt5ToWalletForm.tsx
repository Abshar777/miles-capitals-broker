import React, { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaDollarSign,
  FaTelegram,
  FaUpload,
} from "react-icons/fa6";
import { CENT_MULTIPLIER } from "@/constants/mt5.const";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { TbCurrencyDirham } from "react-icons/tb";
import { FaExchangeAlt, FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io5";
import { RiRefreshFill } from "react-icons/ri";
import { currencies, fromCurrencies } from "@/constants/curency";
import TooltipReuse from "../ui/tooltipReuse";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTransfer } from "@/hooks/useTransfer";
import {
  useGetMt5AccList,
  useGetMt5Balance,
  useGetMt5CredList,
} from "@/hooks/useMt5";
import { useMt5ToWalletTransfer } from "@/hooks/useMt5ToWallet";

const Mt5ToWalletForm = () => {
  const [acountOptions, setAcountOptions] = useState<any[]>([
    {
      label: "Loading...",
      value: "",
      iconImage: "/svgs/currency/usd.svg",
      badgeLabel: "Available",
    },
  ]);
  const {
    form,
    errors,
    onFormSubmit,
    isPending,
    accounts,
    disabled,
    selectedAccount,
  } = useMt5ToWalletTransfer();

  useEffect(() => {
    if (accounts.length > 0) {
      setAcountOptions(
        accounts.map((account) => ({
          id: account.login.toString(),
          ID: account.login.toString(),
          label: account.login.toString(),
          value: account.login.toString(),
          iconImage: "/svgs/currency/usd.svg",
          amount: account.account_category === "cent" ? account.balance / CENT_MULTIPLIER || 0 : account.balance || 0,
          badgeLabel: account.account_type,
        }))
      );
    }
  }, [accounts]);

  const { balance } = useGetMt5Balance();

  const isCent = selectedAccount?.account_category === "cent";
  const watchedAmount = Number(form.watch("amount")) || 0;
  const maxAmount = isCent
    ? (selectedAccount?.balance || 0) / CENT_MULTIPLIER
    : (selectedAccount?.balance || 0);

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className=" flex items-center justify-between  gap-4">
          <FormField
            control={form.control}
            name="account_id"
            render={({ field }) => (
              <div className="flex relative flex-1 justify-end items-center">
                <FormGeneratorV2
                  inputType="selectv2"
                  label="Account ID"
                  field={field}
                  options={acountOptions as any}
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a account"
                  Icon={MdCurrencyExchange}
                  indicatorText="Max"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <div className="flex relative flex-1 justify-end items-center">
                <FormGeneratorV2
                  activeDefault={true}
                  inputType="selectv2"
                  label="Currency"
                  field={field}
                  options={
                    currencies.map((e) =>
                      e.symbol == "USD"
                        ? ({ ...e, amount: balance?.available_balance } as any)
                        : e
                    ) as any
                  }
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a currency"
                  Icon={MdCurrencyExchange}
                  indicatorText="Max"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
        </div>
        <div className="mt-3 grid  gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <div className="flex flex-col gap-1 w-full">
                <FormGeneratorV2
                  inputType="input"
                  label="Amount (USD)"
                  Icon={FaDollarSign}
                  field={field}
                  max={maxAmount}
                  errors={errors}
                  indicatorText={`max: $${maxAmount}`}
                  placeholder="Enter amount"
                  type="number"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                />
                {isCent && watchedAmount > 0 && (
                  <p className="text-xs text-muted-foreground pl-1">
                    {(watchedAmount * CENT_MULTIPLIER).toFixed(0)} cents will be debited from your MT5 cent account
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-min"
            disabled={disabled}
            isLoading={isPending}
            text="Transfer"
          />
        </div>
      </form>
    </Form>
  );
};

export default Mt5ToWalletForm;
