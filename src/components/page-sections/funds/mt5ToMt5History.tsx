"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { item_variants } from "@/constants/framer-motion";
import { useDeposit, useDepositeHistory } from "@/hooks/useDeposit";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@heroui/button";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatIST } from "@/lib/utils";
import { FaInfo } from "react-icons/fa6";
import { Modal } from "@/components/ui/modal";
import { TMT5ToMT5TransferHistoryItemApiResponse } from "@/types/api.response";
import { useMTransferHistory } from "@/hooks/useMt5ToMt5";
import { statusBadge } from "@/constants/curency";

const MT5ToMt5History = () => {
  const { data, isLoading, error } = useMTransferHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState<TMT5ToMT5TransferHistoryItemApiResponse | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Modal
        height={20}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Transfer Info of #${dataInfo?.transfer_id?.slice(0, 6)}`}
        description={`Transfer info of #${dataInfo?.transfer_id}`}
      >
        <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2  gap-2  md:gap-4">
          <p>Amount: &nbsp;<span className="text-primary">{dataInfo?.amount} USD</span></p>
          <p>Your Account ID:&nbsp;<span className="text-primary">{dataInfo?.source_login}</span></p>
          <p>Destination Account ID:&nbsp;<span className="text-primary">{dataInfo?.destination_login}</span></p>
          <p>Status:&nbsp;<Badge className="text-xs">{dataInfo?.status}</Badge></p>
          <p>Created At:&nbsp;<span className="text-primary">{formatIST(dataInfo?.created_at as string)}</span></p>
          <p>Completed At:&nbsp;<span className="text-primary">{formatIST(dataInfo?.created_at as string)}</span></p>

        </div>

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <motion.div
        className="md:col-span-1 min-h-[75vh] max-h-[75vh] h-full overflow-hidden "
        variants={item_variants}
      >
        <Card className="h-full w-full">
          <CardHeader className="flex flex-row border-b border-foreground/10 border-dashed justify-between items-center">
            <CardTitle>Mt5 To Mt5 Transfer History</CardTitle>
            {/* <Button
            size="sm"
            color="primary"
            onPress={() => {
              setLoading(true);
              router.push("/root/transactions");
            }}
            isLoading={loading}
            className="w-min"
          >
            {loading ? "" : "See more"}
          </Button> */}
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:p-4 p-3 h-full">
            {data.length == 0 && !isLoading && (
              <div className="flex flex-col h-3/4  justify-center items-center gap-2">
                <img
                  src="/svgs/nothing.svg"
                  alt="total-balance"
                  className=" h-56 grayscale opacity-50 object-cover"
                />
                <p className="text-foreground/50 text-sm">No internal transfer history found</p>
              </div>
            )}
            {isLoading && (
              <div className="flex flex-col h-3/4  justify-start items-center gap-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 bg-foreground/5 w-full" />
                ))}
              </div>
            )}

            <ScrollArea className={cn("max-h-[75vh] h-full")}>
              {data.length > 0 && !isLoading && (
                <div className="flex flex-col h-full justify-start items-center gap-2 mb-14">
                  <div className="flex flex-row w-full justify-between">
                    <p className="text-secondary text-sm">ID</p>
                    <p className="text-secondary text-sm">Amount</p>
                    <p className="text-secondary text-sm">Status</p>
                    <p className="text-secondary text-sm">Info</p>
                  </div>
                  {[...data].map((item, index) => (
                    <div
                      key={item.transfer_id}
                      className="flex flex-col bg-foreground/5 rounded-lg md:p-4 py-4 px-1 w-full  gap-2"
                    >
                      <div className="flex flex-row w-full justify-between gap-2">
                        <p className="text-secondary text-sm">
                          #{item.transfer_id?.slice(0, 6)}
                        </p>
                        <p className="text-foreground text-sm">
                          ${item.amount}
                        </p>
                        <Badge variant={statusBadge[item.status as keyof typeof statusBadge] as any} className=" text-xs">
                          {item.status}
                        </Badge>
                        <Button isIconOnly size="sm" color="primary" onPress={() => {
                          setDataInfo(item);
                          setIsOpen(true);
                        }}>
                          <FaInfo />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default MT5ToMt5History;
