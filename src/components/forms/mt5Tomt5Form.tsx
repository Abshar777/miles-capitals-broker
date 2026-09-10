import React, { useEffect, useState } from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import FormGeneratorV2 from "../global/form-generator/v2";
import { FaDollarSign, FaMoneyBillTransfer, FaUser } from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { USDCurrencies } from "@/constants/curency";
import { Button } from "../ui/button";
import { useGetMt5Balance } from "@/hooks/useMt5";
import { useMT5ToMT5Transfer } from "@/hooks/useMt5ToMt5";
import { FaInfoCircle } from "react-icons/fa";

const Mt5ToMt5Form = () => {
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
    accounts,
    disabled,
    selectedAccount,
  } = useMT5ToMT5Transfer();

  useEffect(() => {
    if (accounts.length > 0) {
      setAcountOptions(
        accounts.map((account) => ({
          id: account.login.toString(),
          ID: account.login.toString(),
          label: account.login.toString(),
          value: account.login.toString(),
          iconImage: "/svgs/currency/usd.svg",
          badgeLabel: account.account_type,
          amount: account.balance || 0,
        }))
      );
    }
  }, [accounts]);

  const isCent = selectedAccount?.account_category === "cent";

  

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="mb-3 grid md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormGeneratorV2
                inputType="input"
                label="Amount"
                Icon={FaDollarSign}
                field={field}
                max={selectedAccount?.balance || 0}
                indicatorText={`max: ${selectedAccount?.balance || 0}`}
                errors={errors}
                placeholder="Enter amount"
                type="number"
                className={{
                  input:
                    "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ",
                  main: "w-full ",
                }}
              />
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
        <div className=" flex md:flex-row flex-col items-center justify-between  gap-4">
          <FormField
            control={form.control as any}
            name="source_login"
            render={({ field }) => (
              <div className="flex relative w-full flex-1 justify-end items-center">
                <FormGeneratorV2
                  activeDefault={true}
                  inputType="selectv2"
                  label="Your Account Id"
                  field={field}
                  options={acountOptions as any}
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a account"
                  Icon={FaUser}
                  className={{
                    input:
                      "w-full bg-muted-foreground/10 dark:bg-muted dark:border-muted-foreground/10 border-muted-foreground/20 ",
                    main: "w-full ",
                  }}
                />
              </div>
            )}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-min border-none bg-muted-foreground/20  md:translate-y-2"
          >
            <FaMoneyBillTransfer />
          </Button>
          <FormField
            control={form.control as any}
            name="destination_login"
            render={({ field }) => (
              <div className="flex relative w-full flex-1 justify-end items-center">
                <FormGeneratorV2
                  // activeDefault={true}
                  inputType="selectv2"
                  label="Destination Account Id"
                  field={field}
                  options={acountOptions.filter(
                    (account) =>
                      account.value !== selectedAccount?.login.toString()
                  )}
                  // max={lockPeriodData?.withdrawableAmount || 10}
                  errors={errors}
                  placeholder="Select a account"
                  Icon={FaUser}
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

        <div className="mt-6 flex justify-end">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-min"
            disabled={disabled}
            isLoading={isPending}
            text="Mt5 To Mt5 Transfer"
          />
        </div>
      </form>
    </Form>
  );
};

export default Mt5ToMt5Form;
