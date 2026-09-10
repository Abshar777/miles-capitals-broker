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


import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import Mt5ToMt5Form from "@/components/forms/mt5Tomt5Form";
import InternalTransferForm from "@/components/forms/inetrnalTransferForm";
import Mt5ToWalletForm from "@/components/forms/mt5ToWalletForm";

const Mt5ToWalletTransferCard = () => {
  return (
    <motion.div className="md:col-span-2 md:pr-6" variants={item_variants}>
      <Card className="bg-transparent py-0 gap-4">
        <CardHeader className="px-0"><CardTitle>MT5 to Wallet</CardTitle></CardHeader>
        <CardContent className="relative px-0 pb-10">
          <p className="mb-4 text-[15px] leading-6 text-muted-foreground">Note! You can transfer funds from your MT5 account to your wallet.</p>
          <Mt5ToWalletForm />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Mt5ToWalletTransferCard;
