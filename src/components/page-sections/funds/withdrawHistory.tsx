"use client";
import HistoryList, { HistoryRow } from "@/components/page-sections/funds/HistoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { item_variants } from "@/constants/framer-motion";
import { useDeposit, useDepositeHistory } from "@/hooks/useDeposit";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatIST } from "@/lib/utils";
import { useCancelWithdrawal, useWithdrawHistory } from "@/hooks/useWithdraw";
import { FaInfo } from "react-icons/fa6";
import { TWithdrawHistoryApiResponse } from "@/types/api.response";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { MdOutlineContentCopy } from "react-icons/md";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { statusBadge } from "@/constants/curency";

const WithdrawHistory = () => {
  const { withdrawHistory, isLoading, error } = useWithdrawHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [dataInfo, setDataInfo] = useState<TWithdrawHistoryApiResponse | null>(
    null
  );

  const {
    mutate: cancelWithdrawalMutate,
    isPending: cancelWithdrawalPending,
    error: cancelWithdrawalError,
    isSuccess: cancelWithdrawalSuccess,
  } = useCancelWithdrawal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (cancelWithdrawalSuccess) {
      setIsOpen(false);
    }
  }, [cancelWithdrawalSuccess]);
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
              {dataInfo?.amount} {dataInfo?.currency}
            </span>
          </p>
          <p>
            Status:&nbsp;
            <Badge
              variant={
                statusBadge[dataInfo?.status as keyof typeof statusBadge] as any
              }
              className="text-xs"
            >
              {dataInfo?.status}
            </Badge>
          </p>
          <p className="col-span-2">
            Withdrawal Method:&nbsp;
            <span className="text-primary">{dataInfo?.group_name}</span>
          </p>

          {Object.entries(dataInfo?.details ?? {}).map(([key, value]) => (
            <p className="col-span-2">
              {key}:&nbsp;
              <span className="text-primary">{value}</span>
            </p>
          ))}

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
          {dataInfo?.admin_notes && (
            <Alert className="mt-4 bg-blue-600/10 border-blue-500/20 col-span-2">
              <AlertTitle>Info!</AlertTitle>
              <AlertDescription>{dataInfo?.admin_notes}</AlertDescription>
            </Alert>
          )}
          {dataInfo?.status === "pending" && (
            <div className="col-span-2">
              <Button
                variant="solid"
                isIconOnly
                size="md"
                color="primary"
                className="w-full"
                onPress={() => {
                  cancelWithdrawalMutate(dataInfo?.withdrawal_id as string);
                }}
                isLoading={cancelWithdrawalPending}
              >
                {cancelWithdrawalPending ? "Cancelling..." : "Cancel"}
              </Button>
            </div>
          )}
        </div>

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <HistoryList
        title="Withdraw"
        isLoading={isLoading}
        rows={(withdrawHistory || []).map((item: any): HistoryRow => ({ id: item.withdrawal_id, label: "Withdrawal", sub: item.group_name || undefined, date: item.created_at, amount: item.amount, currency: item.currency, status: item.status, direction: "out", raw: item }))}
        onInfo={(r) => {
          setDataInfo(r.raw);
          setIsOpen(true);
        }}
      />
    </>
  );
};

export default WithdrawHistory;
