import React from "react";
import { Form, FormField } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useDeposit } from "@/hooks/useDeposit";
import FormGeneratorV2 from "../global/form-generator/v2";
import {
  FaArrowRight,
  FaDollarSign,
  FaProductHunt,
  FaTelegram,
  FaUpload,
  FaUser,
} from "react-icons/fa6";
import AnimatedButton from "../global/animatedButton";
import { MdCurrencyExchange } from "react-icons/md";
import { useCreateMt5Acc } from "@/hooks/useMt5";
import { mt5Currencies, mt5Leverage, mt5Products } from "@/constants/mt5.const";

const Mt5AccountForm = ({ type }: { type: "Live" | "Demo" }) => {
  const { form, errors, onFormSubmit, isPending, isPendingGroups, groups } = useCreateMt5Acc({ type });
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className="">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <div className="flex relative ">
                  <FormGeneratorV2
                    disabled={true}
                    activeDefault={true}
                    inputType="input"

                    label="First Name"
                    field={field}
                    // max={lockPeriodData?.withdrawableAmount || 10}
                    errors={errors}
                    placeholder="Enter First Name"
                    Icon={FaUser}
                    className={{
                      input: "w-full ",
                      main: "w-full ",
                    }}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <div className="flex relative ">
                  <FormGeneratorV2
                    disabled={true}
                    activeDefault={true}
                    inputType="input"
                    label="Last Name"
                    field={field}
                    // max={lockPeriodData?.withdrawableAmount || 10}
                    errors={errors}
                    placeholder="Enter Last Name"
                    Icon={FaUser}
                    className={{
                      input: "w-full ",
                      main: "w-full ",
                    }}
                  />
                </div>
              )}
            />
          </div>

          <div className="flex w-full flex-col gap-4">

            <div className="grid grid-cols-1  gap-4">
              {type !== "Demo" && (
                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <div className="flex relative justify-end items-center">
                      <FormGeneratorV2
                        activeDefault={true}
                        inputType="select"
                        label="Account Category"
                        field={field}
                        isFetching={isPendingGroups}
                        disabled={isPendingGroups}
                        options={groups?.available_account_categories.filter((e) => e !== "demo").map((e, i) => ({
                          id: i + 1,
                          name: e.toUpperCase(),
                          label: e.toUpperCase(),
                          value: e,
                        })) as any}
                        errors={errors}
                        placeholder="Select Account Category"
                        Icon={FaProductHunt}
                        className={{
                          input: "w-full ",
                          main: "w-full ",
                        }}
                      />
                    </div>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <div className="flex relative justify-end items-center">
                    <FormGeneratorV2
                      activeDefault={true}
                      inputType="selectv2"
                      label="Currency"
                      field={field}
                      options={mt5Currencies as any}
                      // max={lockPeriodData?.withdrawableAmount || 10}
                      errors={errors}
                      placeholder="Select a currency"
                      Icon={MdCurrencyExchange}
                      indicatorText="Max"
                      className={{
                        input: "w-full ",
                        main: "w-full ",
                      }}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="leverage"
                render={({ field }) => (
                  <div className="flex relative justify-end items-center">
                    <FormGeneratorV2
                      activeDefault={false}
                      inputType="select"
                      label="Leverage"
                      field={field}
                      options={mt5Leverage as any}
                      // max={lockPeriodData?.withdrawableAmount || 10}
                      errors={errors}
                      placeholder="Select Leverage"
                      Icon={FaDollarSign}
                      className={{
                        input: "w-full  ",
                        main: "w-full ",
                      }}
                    />
                  </div>
                )}
              />
              {type === "Demo" && (
                <FormField
                  control={form.control}
                  name="initial_balance"
                  render={({ field }) => (
                    <div className="flex relative justify-end items-center">
                      <FormGeneratorV2
                        inputType="input"
                        label="Initial Balance (USD)"
                        Icon={FaDollarSign}
                        field={field}
                        errors={errors}
                        
                        disabled={true}
                        placeholder="Enter initial demo balance"
                        type="number"
                        className={{
                          input: "w-full",
                          main: "w-full",
                        }}
                      />
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full mt-4 mb-4 items-center">
          <AnimatedButton
            size="md"
            type="submit"
            className="w-full"
            isLoading={isPending}
            text="Create Account"
          />
        </div>
      </form>
    </Form>
  );
};

export default Mt5AccountForm;
