"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React from "react";
import DepositForm from "@/components/forms/depositForm";
import TransferForm from "@/components/forms/transferForm";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

const transferCard = () => {
  return (
    <motion.div className="md:col-span-2 md:pr-6" variants={item_variants}>
      <Card className="bg-transparent py-0 gap-4">
        <CardHeader className="px-0"><CardTitle>Transfer</CardTitle></CardHeader>
        <CardContent className="relative px-0 pb-10">
          <p className="mb-4 text-[15px] leading-6 text-muted-foreground">Note! Transfer your wallet balance to your mt5 account</p>
          <TransferForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default transferCard;
