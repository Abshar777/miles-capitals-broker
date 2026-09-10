import React, { useCallback, useEffect, useState } from "react";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import { useTermsForAction } from "@/hooks/useTerms";
import TermsDisplay from "@/components/terms/TermsDisplay";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaCode,
  FaCodeBranch,
  FaDollarSign,
  FaIdCard,
  FaLocationDot,
  FaNetworkWired,
  FaPhone,
  FaRoute,
  FaTelegram,
  FaUpload,
  FaUser,
  FaWallet,
  FaArrowTrendDown,
} from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import {
  MdAccountBalanceWallet,
  MdCurrencyExchange,
  MdNumbers,
} from "react-icons/md";
import { TbCurrencyDirham } from "react-icons/tb";
import { FaExchangeAlt, FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io5";
import { RiRefreshFill } from "react-icons/ri";
import {
  collectorIdTypes,
  currencies,
  fromCurrencies,
  networks,
  withdrawalMethods,
} from "@/constants/curency";
import TooltipReuse from "../ui/tooltipReuse";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTransfer } from "@/hooks/useTransfer";
import { useGetMt5AccList, useGetMt5Balance } from "@/hooks/useMt5";
import { useWithdraw } from "@/hooks/useWithdraw";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { CiBank } from "react-icons/ci";
import { TWithdrawalTypeApiResponse } from "@/types/api.response";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import { Icon } from "@radix-ui/react-select";

const WithdrawForm = () => {
  const {
    form,
    errors,
    onFormSubmit,
    isPending,
    withdrawalMethod,
    setWithdrawalMethod,
    currencies: availableCurrencies,
    methods,
    onChangeWithdrawalType,
    selectedWithdrawalType,
    onChangeData,
    minWithdrawal,
    maxWithdrawal,
  } = useWithdraw();
  const { balance } = useGetMt5Balance();

  const { terms: withdrawTerms, isPending: termsLoading } = useTermsForAction({
    action_type: "withdraw",
    withdrawal_type_id: selectedWithdrawalType?.id ?? null,
    enabled: !!selectedWithdrawalType,
  });

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className=" flex items-center justify-between w-full  gap-4">
          <div className="flex flex-col gap-2 w-full justify-center">
            <Label>
              Withdrawal Method <span className="text-primary">*</span>
            </Label>
            <Select
              value={withdrawalMethod}
              onValueChange={(e) => onChangeWithdrawalType(e)}
            >
              <SelectTrigger
                className="bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20"
                defaultValue={withdrawalMethod}
              >
                <SelectValue
                  className="bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20"
                  defaultValue={withdrawalMethod}
                  placeholder="Select a withdrawal method"
                />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem value={method} key={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-4">
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
                    currencies
                      .filter((currency) =>
                        availableCurrencies.some((f) => f === currency.symbol)
                      )
                      .map((currency) =>
                        currency.value == "USD"
                          ? ({
                            ...currency,
                            amount: balance?.available_balance,
                          } as any)
                          : currency
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

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => {
              const effectiveMax = maxWithdrawal > 0
                ? Math.min(maxWithdrawal, balance?.available_balance ?? Infinity)
                : balance?.available_balance;
              const hint = [
                minWithdrawal > 0 ? `Min: $${minWithdrawal}` : null,
                maxWithdrawal > 0 ? `Max: $${maxWithdrawal}` : (balance?.available_balance != null ? `Max: $${balance.available_balance}` : null),
              ].filter(Boolean).join(" · ");
              return (
                <FormGeneratorV2
                  inputType="input"
                  label="Amount"
                  Icon={FaDollarSign}
                  field={field}
                  errors={errors}
                  placeholder="Enter amount"
                  type="number"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                    main: "w-full ",
                  }}
                  max={effectiveMax}
                  indicatorText={hint}
                />
              );
            }}
          />

          {selectedWithdrawalType &&
            selectedWithdrawalType.fields.map((field) => (
              <WithdrawalTypeField
                key={field.name}
                field={field}
                label={field.label}
                isRequired={field.required}
                placeholder={field?.placeholder || ""}
                Icon={FaDollarSign}
                onChange={(value) => {
                  onChangeData({ [field.name]: value });
                }}
              />
            ))}
        </div>
        {/* Terms & Conditions */}
        {(withdrawTerms.length > 0 || termsLoading) && (
          <div className="mt-4 flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Terms &amp; Conditions
            </h3>
            <TermsDisplay terms={withdrawTerms} isLoading={termsLoading} />
          </div>
        )}

        <div className="mt-6 flex md:flex-row flex-col items-center justify-between md:gap-4 gap-4">
          {/* Balance before → after */}
          {(() => {
            const amount = parseFloat(form.watch("amount") as any || "0") || 0;
            const before = balance?.available_balance ?? 0;
            const after  = before - amount;
            if (amount <= 0) return <div />;
            return (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-foreground/50">balance</span>
                  <span className="text-xs flex items-center gap-1.5">
                    <span className="text-foreground/70">${Number(before).toFixed(2)}</span>
                    <FaArrowRight className="size-2.5 text-muted-foreground" />
                    <span className={`font-medium ${after < 0 ? "text-destructive" : "text-orange-400"}`}>
                      ${Number(after).toFixed(2)}
                    </span>
                    <FaArrowTrendDown className={`size-3 ${after < 0 ? "text-destructive" : "text-orange-400"}`} />
                  </span>
                </div>
                {after < 0 && (
                  <span className="text-[11px] text-destructive">Insufficient balance</span>
                )}
              </div>
            );
          })()}
          <AnimatedButton
            size="md"
            type="submit"
            className="w-min"
            isLoading={isPending}
            text="Withdraw Request"
          />
        </div>
      </form>
    </Form>
  );
};

export default WithdrawForm;

const WithdrawalTypeField = ({
  field,
  label,
  isRequired,
  placeholder,
  Icon,
  onChange,
}: {
  field: any;
  label: string;
  isRequired: boolean;
  placeholder: string;
  Icon: IconType;
  onChange: (value: string) => void;
}) => {
  return (
    <div className={cn("flex flex-col  gap-2 ")}>
      <Label className={cn("flex items-center gap-1")}>
        {label && label}
        {label && isRequired && <span className="text-primary">*</span>}
      </Label>
      <div className="flex relative items-center justify-end">
        <div className="flex relative w-full  items-center justify-end">
          {Icon && (
            <Icon className={cn("absolute text-sm left-2 text-foreground")} />
          )}{" "}
          <Input
            // min={min}
            id={field.name}
            type={"text"}
            placeholder={placeholder}
            className={cn(
              `  px-[1.7rem]  flex-1 w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20`
            )}
            value={field.value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};
