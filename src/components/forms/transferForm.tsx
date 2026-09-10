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
import { useGetMt5AccList, useGetMt5Balance, useGetMt5CredList, } from "@/hooks/useMt5";
import { CENT_MULTIPLIER } from "@/constants/mt5.const";

const TransferForm = () => {
  const [acountOptions, setAcountOptions] = useState<any[]>([{
    label: "Loading...",
    value: "",
    iconImage: '/svgs/currency/usd.svg',
    badgeLabel: "Available"
  }]);
  const {
    form,
    errors,
    onFormSubmit,
    isPending,
    accounts,
    disabled,
  } = useTransfer();


  useEffect(() => {
    if (accounts) {
      setAcountOptions(accounts.map((account) => ({
        id: account.login.toString(),
        ID: account.login.toString(),
        label: account.login.toString(),
        value: account.login.toString(),
        iconImage: '/svgs/currency/usd.svg',
        amount: account.account_category === "cent" ? account.balance / CENT_MULTIPLIER || 0 : account.balance || 0,
        badgeLabel: account.account_type,

      })));
    }
  }, [accounts]);

  const { balance } = useGetMt5Balance();

  const watchedAccountId = form.watch("account_id");
  const selectedAccount = accounts?.find(
    (a) => a.login.toString() === watchedAccountId
  );
  const isCent = selectedAccount?.account_category === "cent";
  const watchedAmount = Number(form.watch("amount")) || 0;

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className=" flex items-center justify-between  gap-4">
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
                  options={currencies.map(e => e.symbol == "USD" ? { ...e, amount: balance?.available_balance } as any : e) as any}
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a currency"
                  Icon={MdCurrencyExchange}
                  indicatorText="Max"
                  className={{
                    input: "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />

        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormGeneratorV2
                inputType="input"
                label="Amount"
                Icon={FaDollarSign}
                field={field}
                max={balance?.available_balance || 0}
                indicatorText={`max: ${balance?.available_balance || 0}`}
                errors={errors}
                placeholder="Enter amount"
                type="number"
                className={{
                  input: "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                  main: "w-full ",
                }}
              />
            )}
          />
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
                    input: "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
        </div>
        {isCent && watchedAmount > 0 && (
          <Alert className="mt-3 border-blue-500/40 bg-blue-500/5">
            <FaInfoCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-600 text-sm">
              Cent Account: Depositing ${watchedAmount} will credit{" "}
              {watchedAmount * CENT_MULTIPLIER} cents to your MT5 account
            </AlertTitle>
          </Alert>
        )}
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

export default TransferForm;
