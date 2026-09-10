"use client";
import HistoryList, { HistoryRow } from "@/components/page-sections/funds/HistoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Modal } from "@/components/ui/modal";
import {
  useCancelWalletTransfer,
  useWalletTransferHistory,
} from "@/hooks/useInternalTransfer";
import { Button } from "@heroui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatIST } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { statusBadge } from "@/constants/curency";
import { FaInfo } from "react-icons/fa6";
import { TWalletTransferHistory } from "@/types/api.response";
import { MdOutlineContentCopy } from "react-icons/md";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CancelInternalTransfer from "./cancelInternalTransfer";
import { toast } from "sonner";

const IneternalTransferHistory = () => {
  const { data, isLoading, isError, isSuccess, error } =
    useWalletTransferHistory();
  // const { data, isLoading, error } = useInternalTransferHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState<TWalletTransferHistory | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    mutate: cancelWalletTransferMutate,
    isPending: cancelWalletTransferPending,
    error: cancelWalletTransferError,
    isSuccess: cancelWalletTransferSuccess,
  } = useCancelWalletTransfer();

  useEffect(() => {
    if (cancelWalletTransferSuccess) {
      setIsOpen(false);
    }
  }, [cancelWalletTransferSuccess]);
  return (
    <>
      <Modal
        height={20}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Transfer Info of #${dataInfo?.transfer_id}`}
        description={`Transfer info of #${dataInfo?.transfer_id}`}
      >
        <div className="flex flex-col w-full gap-2">
          <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2  gap-2  md:gap-4">
            <p className="col-span-2 group  flex items-center gap-2">
              ID:&nbsp;
              <span className="text-primary">{dataInfo?.transfer_id}</span>
              <Button
                variant="faded"
                isIconOnly
                size="sm"
                color="primary"
                onPress={() => {
                  navigator.clipboard.writeText(dataInfo?.transfer_id ?? "");
                }}
                className="scale-90 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <MdOutlineContentCopy />
              </Button>
            </p>
            <p>
              Amount: &nbsp;
              <span className="text-primary">{dataInfo?.amount} USD</span>
            </p>
            <p>
              From Account ID:&nbsp;
              <span className="text-primary">{dataInfo?.from_user_id}</span>
            </p>
            <p>
              From Account Name:&nbsp;
              <span className="text-primary">{dataInfo?.from_user_name}</span>
            </p>
            <p>
              To Account ID:&nbsp;
              <span className="text-primary">{dataInfo?.to_user_id}</span>
            </p>
            <p>
              To Account Name:&nbsp;
              <span className="text-primary">{dataInfo?.to_user_name}</span>
            </p>
            <p>
              Status:&nbsp;
              <Badge
                variant={
                  statusBadge[
                    dataInfo?.status as keyof typeof statusBadge
                  ] as any
                }
                className="text-xs"
              >
                {dataInfo?.status}
              </Badge>
            </p>
            <p className="col-span-2">
              Created At:&nbsp;
              <span className="text-primary">
                {formatIST(dataInfo?.created_at as string)}
              </span>
            </p>

            <p className="col-span-2">
              Completed At:&nbsp;
              <span className="text-primary">
                {formatIST(dataInfo?.created_at as string)}
              </span>
            </p>
          </div>
          {dataInfo?.status === "pending" && (
            <div className="col-span-2">
              <CancelInternalTransfer
                status={dataInfo?.status as string}
                id={dataInfo?.transfer_id as string}
                onSuccess={() => {
                  setIsOpen(false);
                 
                }}
              />
            </div>
          )}
        </div>

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <HistoryList
        title="Internal Transfer"
        isLoading={isLoading}
        rows={(data || []).map((item: any): HistoryRow => ({ id: item.transfer_id, label: "Internal Transfer", sub: item.to_user_name ? `To ${item.to_user_name}` : undefined, date: item.created_at, amount: item.amount, currency: item.currency || "USD", status: item.status, direction: "neutral", raw: item }))}
        onInfo={(r) => {
          setDataInfo(r.raw);
          setIsOpen(true);
        }}
      />
    </>
  );
};

export default IneternalTransferHistory;
