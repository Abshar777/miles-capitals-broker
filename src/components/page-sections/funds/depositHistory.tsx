"use client";
import HistoryList, { HistoryRow } from "@/components/page-sections/funds/HistoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { item_variants } from "@/constants/framer-motion";
import {
  useDeposit,
  useDepositeHistory,
  useDeleteDeposit,
} from "@/hooks/useDeposit";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import AnimatedButton from "@/components/global/animatedButton";
import { useRouter } from "nextjs-toploader/app";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatIST } from "@/lib/utils";
import { FaInfo, FaTrashAlt } from "react-icons/fa";
import { Modal } from "@/components/ui/modal";
import { currencySymbols } from "@/constants/curency";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TDepositHistoryApiResponse } from "@/types/api.response";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "sonner";

const DepoitHistory = () => {
  const { depositHistory, isLoading, isError, isSuccess, error } =
    useDepositeHistory();
  const {
    mutate,
    isPending,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
    setId,
  } = useDeleteDeposit();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [dataInfo, setDataInfo] = useState<TDepositHistoryApiResponse | null>(
    null
  );

  useEffect(() => {
    if (isSuccessDelete) {
      setIsOpen(false);
    }
  }, [isSuccessDelete]);
  return (
    <>
      <Modal
        height={20}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Deposit"
        description="Are you sure you want to delete this deposit?"
      >
        <div className="grid grid-cols-2  gap-4">
          <Button
            size="sm"
            onPress={() => mutate({})}
            className="text-xs bg-destructive/70 w-full"
            isIconOnly
            isLoading={isPending}
          >
            <span>Delete</span>
          </Button>
          <Button
            size="sm"
            onPress={() => setIsOpen(false)}
            className="text-xs w-full "
            isIconOnly
          >
            <span>Cancel</span>
          </Button>
        </div>
      </Modal>
      <Modal
        height={20}
        isOpen={isOpenInfo}
        onClose={() => setIsOpenInfo(false)}
        title={`Deposit Info of ${dataInfo?.deposit_id}`}
        description={``}
      >
        <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2  gap-2  md:gap-4">
          <p className="col-span-2  flex items-center gap-2">
            ID:&nbsp;
            <span className="text-primary">{dataInfo?.deposit_id}</span>
            <Button
              variant="faded"
              isIconOnly
              size="sm"
              color="primary"
              onPress={async () => {
                await navigator.clipboard.writeText(dataInfo?.deposit_id ?? "");
                toast.success("Deposit ID copied to clipboard");
              }}
              className="scale-90"
            >
              <MdOutlineContentCopy />
            </Button>
          </p>
          <p>
            Deposited Amount: &nbsp;
            <span className="text-primary">
              {dataInfo?.amount}&nbsp;{dataInfo?.currency}
            </span>
          </p>
          <p>
            Received Amount: &nbsp;
            <span className="text-primary">
              {dataInfo?.receive_amount}&nbsp;USD
            </span>
          </p>
          {dataInfo?.commission_amount != null && (
            <p>
              Commission: &nbsp;
              <span className="text-primary">
                {dataInfo.commission_amount.toFixed(2)}&nbsp;USD
              </span>
            </p>
          )}
          <p>
            Status:&nbsp;<Badge variant={dataInfo?.status === "pending" ? "warning" : dataInfo?.status === "approved" ? "success" : "destructive"} className="text-xs">{dataInfo?.status}</Badge>
          </p>
          <p className="col-span-2">
            Created At:&nbsp;
            <span className="text-primary">
              {formatIST(dataInfo?.created_at as string)}
            </span>
          </p>

          <p className="col-span-2">
            Approved At:&nbsp;
            <span className="text-primary">
              {formatIST(dataInfo?.approved_at)}
            </span>
          </p>

          {dataInfo?.admin_notes && (
            <Alert className="mt-4 bg-blue-600/10 border-blue-500/20 col-span-2">
              <AlertTitle>Admin Notes</AlertTitle>
              <AlertDescription>
                {dataInfo?.admin_notes ?? "No admin notes"}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <HistoryList
        title="Deposit"
        isLoading={isLoading}
        rows={(depositHistory || []).map((item: any): HistoryRow => ({ id: item.deposit_id, label: "Deposit", sub: item.payment_mode ? String(item.payment_mode).replace("admin_", "").replace(/_/g, " ") : undefined, date: item.created_at, amount: item.amount, currency: item.currency, status: item.status, direction: "in", raw: item }))}
        onInfo={(r) => {
          setDataInfo(r.raw);
          setIsOpenInfo(true);
        }}
      />
    </>
  );
};

export default DepoitHistory;
