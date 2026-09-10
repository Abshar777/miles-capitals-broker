import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaDollarSign,
  FaTelegram,
  FaUpload,
  FaArrowTrendUp,
} from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { TbCurrencyDirham } from "react-icons/tb";
import { FaInfoCircle, FaRupeeSign } from "react-icons/fa";
import { IoLogoUsd } from "react-icons/io5";
import { RiRefreshFill } from "react-icons/ri";
import { currencies } from "@/constants/curency";
import TooltipReuse from "../ui/tooltipReuse";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useGetMt5Balance } from "@/hooks/useMt5";
import { useCreateCoinsbayDeposit } from "@/hooks/useCoinsbay";
import Image from "next/image";
import { useTermsForAction } from "@/hooks/useTerms";
import TermsDisplay from "@/components/terms/TermsDisplay";
import { useCoinsbayIntentStatus } from "@/hooks/useCoinsbay";
import { useCoinsbayUiStore } from "@/store/coinsBayUiStore";
import { Loader2 } from "lucide-react";

const DepositForm = () => {
  const {
    form,
    errors,
    onFormSubmit,
    paymentMethodAvl,
    selectedPaymentMethod,
    currentUsdRate,
    agoUsdRate,
    usdRefetch,
    usdRefetching,
    usdLoading,
    isPending,
    currencies: fromCurrencies,
    availableCurrenciesLoading,
    paymentOptionsRefetching,
    paymentOptionsLoading,
    paymentMode,
    commissionPercent,
    commissionFeeUsd,
    commissionFeeBase,
  } = useDeposit();


  

  const fromCurrency = form.watch("from") || "USD";

  const { balance } = useGetMt5Balance();

  // Fetch T&C for the selected payment method (or generic deposit T&C)
  const { terms: depositTerms, isPending: termsLoading } = useTermsForAction({
    action_type: "deposit",
    payment_option_id: selectedPaymentMethod?.id ?? null,
    enabled: !!selectedPaymentMethod,
  });

  // Coinsbay intent status — polls while checkout window is open
  const { value: activeIntentId, setValue: clearIntentId } = useCoinsbayUiStore();
  const { intentStatus } = useCoinsbayIntentStatus(activeIntentId);
  const image_url = !selectedPaymentMethod?.image_url?.startsWith("https://")
    ? selectedPaymentMethod?.image_url : (process.env.NEXT_PUBLIC_R2_URL as string || "") + new URL(selectedPaymentMethod?.image_url).pathname;
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="flex flex-col gap-4">

          {/* Coinsbay payment status banner */}
          {activeIntentId && intentStatus && (
            <div
              className={cn(
                "rounded-xl border px-4 py-3 flex items-start gap-3 text-sm",
                intentStatus.status === "paid"
                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                  : intentStatus.status === "expired" || intentStatus.status === "cancelled"
                    ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
              )}
            >
              {intentStatus.status === "paid" ? (
                <>
                  <span className="text-lg leading-none mt-0.5">✓</span>
                  <div>
                    <p className="font-semibold">Payment confirmed!</p>
                    <p className="text-xs opacity-75 mt-0.5">
                      {intentStatus.amount} {intentStatus.currency} has been credited to your wallet.
                    </p>
                    <button
                      type="button"
                      onClick={() => clearIntentId("")}
                      className="text-xs underline mt-1 opacity-60 hover:opacity-100"
                    >
                      Dismiss
                    </button>
                  </div>
                </>
              ) : intentStatus.status === "expired" ? (
                <>
                  <span className="text-lg leading-none mt-0.5">✕</span>
                  <div>
                    <p className="font-semibold">Payment expired</p>
                    <p className="text-xs opacity-75 mt-0.5">The payment window timed out. Please try again.</p>
                    <button
                      type="button"
                      onClick={() => clearIntentId("")}
                      className="text-xs underline mt-1 opacity-60 hover:opacity-100"
                    >
                      Dismiss
                    </button>
                  </div>
                </>
              ) : intentStatus.status === "cancelled" ? (
                <>
                  <span className="text-lg leading-none mt-0.5">✕</span>
                  <div>
                    <p className="font-semibold">Payment cancelled</p>
                    <p className="text-xs opacity-75 mt-0.5">The payment was cancelled. Please try again.</p>
                    <button
                      type="button"
                      onClick={() => clearIntentId("")}
                      className="text-xs underline mt-1 opacity-60 hover:opacity-100"
                    >
                      Dismiss
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Waiting for payment…</p>
                    <p className="text-xs opacity-75 mt-0.5">
                      Complete your {intentStatus.amount} {intentStatus.currency} transfer in the payment window.
                      This page will update automatically.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <div className="flex relative justify-end items-center">
                <FormGeneratorV2
                  activeDefault={true}
                  inputType="selectv2"
                  label="To"
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

          <div className="flex w-full flex-col gap-4">
            <h1 className="text-[18px] leading-6 font-medium text-foreground">Using</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <div className="flex relative justify-end items-center">
                    <FormGeneratorV2
                      // activeDefault={true}
                      inputType="selectv2"
                      label="From"
                      field={field}
                      isFetching={availableCurrenciesLoading}
                      options={fromCurrencies as any}
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
                name="paymentMethod"
                render={({ field }) => (
                  <div className="flex relative justify-end items-center">
                    <FormGeneratorV2
                      activeDefault={false}
                      inputType="selectv2"
                      label="Payment Method"
                      field={field}
                      isFetching={
                        paymentOptionsLoading || paymentOptionsRefetching
                      }
                      options={paymentMethodAvl as any}
                      // max={lockPeriodData?.withdrawableAmount || 10}
                      errors={errors}
                      placeholder="Select Payment Method"
                      Icon={FaDollarSign}
                      indicatorText="Max"
                      className={{
                        input:
                          "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ps-[3.5rem]",

                        main: "w-full ",
                        // optionImg: "w-10 h-6 rounded-lg",
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          {selectedPaymentMethod && (
            <>
              <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <div className="flex relative justify-end items-center">
                      <FormGeneratorV2
                        activeDefault={true}
                        inputType="input"
                        label="Pay"
                        field={field}

                        type="number"
                        // max={lockPeriodData?.withdrawableAmount || 10}
                        errors={errors}
                        placeholder="Enter amount"
                        Icon={
                          form.watch("from") === "AED"
                            ? TbCurrencyDirham
                            : form.watch("from") === "INR"
                              ? FaRupeeSign
                              : IoLogoUsd
                        }
                        indicatorText={`${form.watch("from")}`}
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
                  name="receiveAmount"
                  render={({ field }) => (
                    <div className="flex relative justify-end items-center">
                      <FormGeneratorV2
                        activeDefault={false}
                        inputType="input"
                        label="Receive Amount"
                        disabled={true}
                        field={field}
                        errors={errors}
                        placeholder="Enter Receive Amount"
                        Icon={IoLogoUsd}
                        indicatorText="USD"
                        type="number"
                        className={{
                          input:
                            "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                          main: "w-full ",
                          optionImg: "w-3 h-6 rounded-lg",
                        }}
                        summeryComp={
                          <>
                            <TooltipReuse
                              arowClassName="  "
                              className="  "
                              trigger={
                                <div className="flex items-center cursor-pointer opacity-50 hover:opacity-100 text-primary gap-2">
                                  <FaInfoCircle />
                                </div>
                              }
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm ">Rate</span>
                                  <span className="text-sm ">
                                    1 {form.watch("from")} ={" "}
                                    {currentUsdRate} USD
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm ">Receive =</span>
                                  <span className="text-sm ">
                                    {field.value} USD
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm ">Fee =</span>
                                  <span className="text-sm text-primary">
                                    {commissionFeeBase > 0
                                      ? `${commissionFeeBase.toFixed(2)} ${fromCurrency}`
                                      : `0 ${fromCurrency}`}
                                  </span>
                                </div>
                                {commissionPercent > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Commission =</span>
                                    <span className="text-sm text-primary">
                                      {commissionPercent}%
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm ">Pay =</span>
                                  <span className="text-sm ">
                                    {form.getValues("amount")}{" "}
                                    {fromCurrency}
                                  </span>
                                </div>
                              </div>
                            </TooltipReuse>
                          </>
                        }
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flexBetween md:w-1/2 w-full">
                <h1 className="text-[18px] leading-6 font-medium text-foreground">
                  {currentUsdRate} {form.watch("from")} ≈ 1 USD
                </h1>
                <div className="flex items-center text-foreground/50  gap-2 text-sm">
                  {/* this is not working propely  */}
                  {agoUsdRate} minutes ago{" "}
                  <RiRefreshFill
                    onClick={() => {
                      usdRefetch();
                    }}
                    className={cn(
                      "text-xl  text-primary cursor-pointer",
                      (usdRefetching || usdLoading) && "animate-spin"
                    )}
                  />
                </div>
              </div>
              {selectedPaymentMethod?.provider === "coinsbuy" && <Alert
                variant="default"
                color="info"
                className=" bg-blue-500/20  border-blue-500/30 gap-2"
              >
                <FaInfoCircle className=" text-xl -translate-y-1.5  fill-blue-500" />
                <AlertDescription className="text-blue-500">
                  You Want To Enable Popup And Redirects Settings In Your Browser
                </AlertDescription>
              </Alert>}
              <Alert
                variant="default"
                color="warning"
                className=" bg-warning/20  border-warning/30 gap-2"
              >
                <FaInfoCircle className=" text-xl -translate-y-1.5  fill-warning" />
                <AlertDescription className="text-warning">
                  The amount you receive is indicative and may vary depending on
                  the rate at the time of the transaction
                </AlertDescription>
              </Alert>
              <div className="flexBetween md:w-1/2 w-full">
                <h1 className="text-sm  text-foreground/50">Time to Fund</h1>
                <div className="flex items-center text-foreground  gap-2 text-sm">
                  Depending on the block chain
                </div>
              </div>
              <Separator />
              {selectedPaymentMethod?.provider !== "coinsbuy" && (
                <>
                  <div className="flex  flex-col gap-3">
                    {Object.entries((selectedPaymentMethod as any)?.parameters).map(
                      ([key, value], i) =>
                        (value as unknown as string)?.trim() !== "" && key !== "isImageRequire" && (
                          <div key={i} className="flex flex-col gap-2">
                            <p className="text-sm text-foreground/50">{key}</p>
                            <Input
                              value={value as string}
                              disabled={true}
                              className="cursor-text disabled:cursor-text"
                            />
                           </div>
                        )
                    )}
                  </div>
                  {selectedPaymentMethod?.image_url && image_url && (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-foreground/50">Qr Code </p>
                      <Image
                        src={image_url}
                        alt="qr code"
                        width={200}
                        height={200}
                        className="cursor-text rounded-2xl disabled:cursor-text"
                      />
                    </div>
                  )}
                {(selectedPaymentMethod as any)?.parameters?.isImageRequire === "true" && <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field }) => (
                        <div className="flex relative justify-end items-center">
                          <FormGeneratorV2
                            activeDefault={true}
                            inputType="upload"
                            label="Upload your payment receipt here."
                            field={field}
                            options={fromCurrencies as any}
                            // max={lockPeriodData?.withdrawableAmount || 10}
                            errors={errors}
                            placeholder="Upload your payment receipt here. "
                            Icon={FaUpload}
                            indicatorText="Max"
                            acceptedFileTypes="image/*"
                            className={{
                              input:
                                "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20",
                              main: "w-full ",
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>}
                </>
              )}
              {/* Terms & Conditions */}
              {(depositTerms.length > 0 || termsLoading) && (
                <div className="flex flex-col gap-2 p-3 rounded-xl border border-border/50 bg-muted/20">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Terms &amp; Conditions
                  </h3>
                  <TermsDisplay terms={depositTerms} isLoading={termsLoading} />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-border/50 pt-4 mt-2">
                <AnimatedButton
                  isLoading={isPending}
                  size="md"
                  type="submit"
                  icon={<FaTelegram className="text-xl" />}
                  text="Send Request"
                  className="w-min md:order-1 order-2"
                />
                <div className="flex md:order-2 order-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="md:text-sm text-xs text-foreground/50">fee ≈</span>
                    <span className={`md:text-sm text-xs font-medium ${commissionFeeBase > 0 ? "text-primary" : "text-foreground"}`}>
                      {commissionFeeBase > 0
                        ? `${commissionFeeBase.toFixed(2)} ${fromCurrency}`
                        : `0 ${fromCurrency}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground/50">receive ≈</span>
                    <span className="text-xs text-foreground flex items-center gap-2">
                      {form.watch("receiveAmount") || 0}&nbsp;USD
                      {commissionFeeUsd > 0 && (
                        <span className="text-xs text-primary">
                          (-{commissionFeeUsd.toFixed(2)} commission)
                        </span>
                      )}
                    </span>
                  </div>
                  {/* Balance before → after */}
                  {(() => {
                    const receiveAmt = parseFloat(form.watch("receiveAmount") as any || "0") || 0;
                    const before = balance?.available_balance ?? 0;
                    const after  = before + receiveAmt;
                    if (receiveAmt <= 0) return null;
                    return (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-foreground/50">balance</span>
                        <span className="text-xs flex items-center gap-1.5">
                          <span className="text-foreground/70">${Number(before).toFixed(2)}</span>
                          <FaArrowRight className="size-2.5 text-muted-foreground" />
                          <span className="text-green-500 font-medium">${Number(after).toFixed(2)}</span>
                          <FaArrowTrendUp className="size-3 text-green-500" />
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        
        </div>

      </form>
    </Form>
  );
};

export default DepositForm;
