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
import { DepositTermsSection } from "@/components/page-sections/funds/DepositTermsSection";
import { useCoinsbayUiStore } from "@/store/coinsBayUiStore";
import { useCoinsbayDepositStatus } from "@/hooks/useCoinsbay";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@heroui/react";

const DepositeCard = () => {
  const { value, setValue } = useCoinsbayUiStore()
  const { depositStatus } = useCoinsbayDepositStatus(value)
  return (
    <motion.div className="md:col-span-2 md:pr-6 relative" variants={item_variants}>
      <Card className="relative bg-transparent py-0 gap-4 overflow-hidden">
        {depositStatus?.status === "pending" && (
          <>
            <div className="absolute p-4 translate-y-[-4%] gap-2 flex items-center justify-center flex-col w-full h-[120%] bg-foreground/10 backdrop-blur-xl z-50">
              <Alert variant={"warning"}>
                <AlertTitle className="flex gap-2 items-center ">Payment pending <Spinner size="sm" color="warning" /></AlertTitle>
                <AlertDescription>
                  Redirecting to payment gateway...
                </AlertDescription>
              </Alert>
              <div className="flex w-full gap-2 items-center justify-between">
                <Button onClick={() => { setValue("") }} variant={"outline"}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  if (depositStatus?.payment_url && typeof window !== "undefined") window.open(depositStatus?.payment_url, "_blank");
                }}>
                  Open Payment Gateway
                </Button>
              </div>
            </div>
          </>
        )}
        <CardHeader className="px-0"><CardTitle>Deposit</CardTitle></CardHeader>
        <CardContent className="relative px-0">
          <DepositForm />
        </CardContent>
      </Card>

      {/* <DepositTermsSection /> */}
       <div className="pb-5"></div>
    </motion.div>
  );
};

export default DepositeCard;
