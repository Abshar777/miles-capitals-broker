import React, { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaDollarSign,
  FaEnvelope,
  FaMoneyBillTransfer,
  FaUser,
} from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { USDCurrencies } from "@/constants/curency";
import { Button } from "../ui/button";
import { useGetMt5Balance } from "@/hooks/useMt5";
import { useWalletToWalletTransfer } from "@/hooks/useInternalTransfer";
import { Spinner } from "@heroui/react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useSession } from "next-auth/react";

const InternalTransferForm = () => {
  const [acountOptions, setAcountOptions] = useState<any[]>([
    {
      label: "Loading...",
      value: "",
      disabled: true,
      iconImage: "/svgs/currency/usd.svg",
      badgeLabel: "Not Available",
    },
  ]);
  const {
    form,
    errors,
    onFormSubmit,
    isPending,
    disabled,
    userIdData,
    userIdError,
    userIdLoading,
  } = useWalletToWalletTransfer();
  
  const { balance } = useGetMt5Balance();
  const { data: session } = useSession();

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="mb-3 grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <div className="flex flex-col gap-1 w-full">
                <FormGeneratorV2
                  inputType="input"
                  label="Amount"
                  Icon={FaDollarSign}
                  field={field}
                  max={balance?.available_balance || 0}
                  errors={errors}
                  placeholder="Enter amount"
                  type="number"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ",
                    main: "w-full ",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    form.setValue("amount", balance?.available_balance || 0)
                  }
                  className="self-end text-xs text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  Available: {balance?.available_balance || 0}
                </button>
              </div>
            )}
          />
          <FormField
            control={form.control as any}
            name="currency"
            render={({ field }) => (
              <div className="flex relative flex-1 justify-end items-center">
                <FormGeneratorV2
                  activeDefault={true}
                  inputType="selectv2"
                  label="Currency"
                  field={field}
                  options={USDCurrencies as any}
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a currency"
                  Icon={MdCurrencyExchange}
                  indicatorText="Max"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
        </div>
        <div className=" flex flex-col items-center justify-between  gap-4">
          <FormField
            control={form.control as any}
            name="destination_login"
            render={({ field }) => (
              <div className="flex relative w-full flex-1 justify-end items-center">
                <FormGeneratorV2
                  activeDefault={true}
                  inputType="input"
                  label="Recipient Email"
                  field={field}
                  errors={errors}
                  placeholder="Enter recipient email"
                  Icon={FaEnvelope}
                  type="email"
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
          {(userIdData as any)?.user_id && (
            <div className="bg-muted-foreground/5 px-4 py-3 border rounded-md w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaUser />
                  <span>{(userIdData as any)?.name}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  <span>{(userIdData as any)?.email}</span>
                </div>
              </div>
            </div>
          )}
          {userIdError && form.watch("destination_login").trim() !== "" && (
            <div className="bg-destructive/10 flex items-center  border-destructive/20 text-destructive text-sm px-4 py-3 border rounded-md w-full gap-2">
              <FaExclamationTriangle className="size-4" />
              <span>
                {session?.user?.email === form.watch("destination_login").trim().toLowerCase()
                  ? "You cannot transfer to your own account"
                  : "No user found with this email"}
              </span>
            </div>
          )}
          {userIdLoading && (
            <div className="bg-muted-foreground/10 px-4 py-3 border rounded-md w-full flex items-center justify-center flex-col gap-2">
              <Spinner />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-min"
            disabled={disabled}
            isLoading={isPending}
            text="Internal Transfer"
          />
        </div>
      </form>
    </Form>
  );
};

export default InternalTransferForm;
