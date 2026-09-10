"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepositeHistory } from "@/hooks/useDeposit";
import useZodForm from "@/hooks/useZodForm";
import { depositeSchema } from "@/schema/funds/deposite.schema";
import React from "react";
import { Form, FormField } from "@/components/ui/form";
import FormGeneratorV2 from "@/components/global/form-generator/v2";
import { currencies, status } from "@/constants/curency";
import { MdCurrencyExchange } from "react-icons/md";
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import DepositList from "@/components/table/deposit/depositList";
import TransferList from "@/components/table/transfer/transferList";

const TransferTransactionsCard = () => {
  const { form, onFormSubmit, errors } = useZodForm(depositeSchema, () => { });
  return (
    <motion.div
      initial="hidden"
      className="w-full h-full"
      animate="visible"
      variants={container_variants}
    >
      <Form {...form}>
        <form onSubmit={onFormSubmit} className="">
          {/* <motion.div
            variants={item_variants}
            className="grid md:grid-cols-3 grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <div className="flex relative  items-center">
                    <FormGeneratorV2
                      activeDefault={true}
                      inputType="selectv2"
                      label="Currency"
                      field={field}
                      options={currencies as any}
                      errors={errors}
                      placeholder="Select a currency"
                      Icon={MdCurrencyExchange}
                      className={{
                        input: "w-full bg-white/5",
                        main: "w-full  ",
                      }}
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <div className="flex relative  items-center">
                    <FormGeneratorV2
                      inputType="select"
                      label="Status"
                      field={field}
                      options={status as any}
                      errors={errors}
                      placeholder="Select a status"
                      Icon={MdCurrencyExchange}
                      className={{
                        input: "w-full bg-white/5",
                        main: "w-full  ",
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </motion.div> */}
        </form>
      </Form>
      <div className="flex flex-col gap-4"></div>

      <motion.div className="w-full h-full" variants={item_variants}>
        <TransferList />
      </motion.div>
    </motion.div>
  );
};

export default TransferTransactionsCard;
