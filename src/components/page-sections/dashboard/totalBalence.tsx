"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { statusBadge } from "@/constants/curency";
import { item_variants } from "@/constants/framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { TAllTransaction } from "@/hooks/useWallet";

const typeLabel: Record<TAllTransaction["type"], string> = {
  deposit:           "Deposit",
  withdrawal:        "Withdrawal",
  wallet_to_mt5:     "Wallet → MT5",
  internal_transfer: "Internal Transfer",
  mt5_to_wallet:     "MT5 → Wallet",
};

const amountColor: Record<TAllTransaction["type"], string> = {
  deposit:           "text-green-500",
  mt5_to_wallet:     "text-green-500",
  internal_transfer: "text-yellow-400",
  withdrawal:        "text-red-500",
  wallet_to_mt5:     "text-red-400",
};

const amountPrefix: Record<TAllTransaction["type"], string> = {
  deposit:           "+",
  mt5_to_wallet:     "+",
  internal_transfer: "",
  withdrawal:        "-",
  wallet_to_mt5:     "-",
};

const TotalBalence = ({
  data,
  isLoading,
}: {
  data: TAllTransaction[];
  isLoading: boolean;
}) => {
  const router = useRouter();

  return (
    <motion.div
      variants={item_variants}
      className="w-full h-full relative rounded-lg overflow-hidden"
    >
      <Card className="w-full h-full">
        <div className="flex flex-col gap-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex border-b pb-2 justify-between w-full items-center">
              <h1 className="md:text-2xl text-xl font-semibold">
                Total Transactions
              </h1>
              <Button
                size="sm"
                isIconOnly
                variant="faded"
                className="text-primary bg-transparent border-none"
                onPress={() => router.push("/root/transactions")}
              >
                <FaArrowRight className="hover:-rotate-45 transition-all duration-300 scale-125" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading && data.length === 0 && (
              <div className="h-56 flex flex-col justify-center items-center gap-2">
                <p className="opacity-50 text-sm">no data found</p>
              </div>
            )}
            {isLoading && (
              <div className="flex flex-col justify-center items-center gap-2">
                <Spinner color="primary" />
              </div>
            )}
            {!isLoading && data.length > 0 && (
              <ScrollArea className="h-[300px]">
                {data.map((e, i) => (
                  <div
                    key={i}
                    className="flex flex-col mb-2 bg-muted-foreground/10 rounded-lg md:p-4 py-4 px-2 w-full gap-2"
                  >
                    <div className="flex flex-row w-full justify-between gap-2 items-center">
                      <p className="text-foreground text-sm whitespace-nowrap">
                        {typeLabel[e.type] ?? e.type}
                        {e.type === "internal_transfer" && e.direction && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({e.direction})
                          </span>
                        )}
                      </p>
                      <p className={cn("text-sm font-medium", amountColor[e.type])}>
                        {amountPrefix[e.type]}&nbsp;{e.amount} {e.currency}
                      </p>
                      <Badge
                        variant={statusBadge[e.status as keyof typeof statusBadge] as any}
                        className="text-xs"
                      >
                        {e.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default TotalBalence;
