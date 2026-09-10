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
import Mt5ListCards from "../mt5/mt5ListCards";
import Mt5ToMt5ransferList from "@/components/table/mt5-mt5/mt5-mt5List";

const Mt5ToMt5TransactionsCard = () => {
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

        </form>
      </Form>
      <div className="flex flex-col gap-4"></div>

      <motion.div className="w-full h-full" variants={item_variants}>
        <Mt5ToMt5ransferList />
      </motion.div>
    </motion.div>
  );
};

export default Mt5ToMt5TransactionsCard;
