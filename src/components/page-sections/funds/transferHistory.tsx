"use client";
import HistoryList, { HistoryRow } from "@/components/page-sections/funds/HistoryList";
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
import { useWithdrawHistory } from "@/hooks/useWithdraw";
import { useTransferHistory } from "@/hooks/useTransfer";
import { FaInfo } from "react-icons/fa6";
import { Modal } from "@/components/ui/modal";
import { TMT5DepositHistoryItemApiResponse } from "@/types/api.response";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";

const TransferHistory = () => {
  const { data, isLoading, error } = useTransferHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [dataInfo, setDataInfo] =
    useState<TMT5DepositHistoryItemApiResponse | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Modal
        height={20}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Transfer Info of ${dataInfo?.withdrawal_id}`}
        description=""
      >
        <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2  gap-2  md:gap-4">
          <p className="col-span-2  flex items-center gap-2">
            ID:&nbsp;
            <span className="text-primary">{dataInfo?.withdrawal_id}</span>
            <Button
              variant="faded"
              isIconOnly
              size="sm"
              color="primary"
              onPress={async () => {
                await navigator.clipboard.writeText(
                  dataInfo?.withdrawal_id ?? ""
                );
                toast.success("Withdrawal ID copied to clipboard");
              }}
              className="scale-90"
            >
              <MdOutlineContentCopy />
            </Button>
          </p>
          <p>
            Amount: &nbsp;
            <span className="text-primary">
              {dataInfo?.deposit_amount} {dataInfo?.currency}
            </span>
          </p>
          <p>
            MT5 Login:&nbsp;
            <span className="text-primary">{dataInfo?.mt5_login}</span>
          </p>
          <p>
            Deal ID:&nbsp;
            <span className="text-primary">{dataInfo?.deal_id}</span>
          </p>
          <p>
            Status:&nbsp;
            <Badge
              variant={
                dataInfo?.status === "pending"
                  ? "warning"
                  : dataInfo?.status === "approved" ||
                    dataInfo?.status === "completed"
                    ? "success"
                    : "destructive"
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
              {formatIST(dataInfo?.completed_at as string)}
            </span>
          </p>
          {dataInfo?.comment && (
            <Alert className="mt-4 bg-blue-600/10 border-blue-500/20 col-span-2">
              <AlertTitle>Info!</AlertTitle>
              <AlertDescription>{dataInfo?.comment}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <HistoryList
        title="Transfer"
        isLoading={isLoading}
        rows={(data || []).map((item: any): HistoryRow => ({ id: item.withdrawal_id, label: "Transfer to MT5", sub: item.mt5_login ? `MT5 ${item.mt5_login}` : undefined, date: item.created_at, amount: item.deposit_amount, currency: item.currency, status: item.status, direction: "out", raw: item }))}
        onInfo={(r) => {
          setDataInfo(r.raw);
          setIsOpen(true);
        }}
      />
    </>
  );
};

export default TransferHistory;
