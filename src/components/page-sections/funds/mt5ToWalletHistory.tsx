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
import { FaInfo } from "react-icons/fa6";
import { Modal } from "@/components/ui/modal";
import { TMT5ToMT5TransferHistoryItemApiResponse } from "@/types/api.response";
import { useMTransferHistory } from "@/hooks/useMt5ToMt5";
import { statusBadge } from "@/constants/curency";
import {
  useMt5ToWalletTransferByID,
  useMt5TransferToWalletHistory,
} from "@/hooks/useMt5ToWallet";
import { useGetMt5AccList } from "@/hooks/useMt5";
import { CENT_MULTIPLIER } from "@/constants/mt5.const";
import { Spinner } from "@heroui/react";

const fmtMt5Balance = (val: number | null | undefined, isCent: boolean) => {
  if (val == null) return "—";
  return isCent ? val / CENT_MULTIPLIER : val;
};
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Mt5ToWalletHistory = () => {
  const { data, isLoading, error } = useMt5TransferToWalletHistory();
  const { accounts } = useGetMt5AccList();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const {
    data: dataInfo,
    isLoading: isLoadingInfo,
    error: errorInfo,
  } = useMt5ToWalletTransferByID(id || "");

  const isTransferCent = dataInfo
    ? accounts.find((a) => a.login === dataInfo.mt5_login)?.account_category === "cent"
    : false;
  return (
    <>
      <Modal
        height={20}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Transfer Info of #${id}`}
        description={`Transfer info of #${id}`}
      >
        {isLoadingInfo && (
          <div className="flex  h-full w-full justify-center items-center gap-2">
            <Spinner color="primary" />
          </div>
        )}
        {dataInfo && (
          <>
            <div className="md:grid flex flex-col bg-card rounded-lg md:p-4 p-2 md:grid-cols-2  gap-2  md:gap-4">
              <p>
                Amount: &nbsp;
                <span className="text-primary">{dataInfo?.amount} USD</span>
              </p>
              <p>
                Mt5 Account ID:&nbsp;
                <span className="text-primary">{dataInfo?.mt5_login}</span>
              </p>
              <p>
                User ID:&nbsp;
                <span className="text-primary">{dataInfo?.user_id}</span>
              </p>
              <p>
                Status:&nbsp;
                <Badge variant={statusBadge[dataInfo?.status as keyof typeof statusBadge] as any} className="text-xs">{dataInfo?.status}</Badge>
              </p>
              <p>
                Before Mt5 Balance:&nbsp;
                <span className="text-primary">
                  {fmtMt5Balance(dataInfo?.mt5_balance_before, isTransferCent)}
                </span>
              </p>
              <p>
                After Mt5 Balance:&nbsp;
                <span className="text-primary">
                  {fmtMt5Balance(dataInfo?.mt5_balance_after, isTransferCent)}
                </span>
              </p>
              <p>
                Before Wallet Balance:&nbsp;
                <span className="text-primary">
                  {dataInfo?.crm_balance_before}
                </span>
              </p>
              <p>
                After Wallet Balance:&nbsp;
                <span className="text-primary">
                  {dataInfo?.crm_balance_after}
                </span>
              </p>
              <p>
                Deal ID:&nbsp;
                <span className="text-primary">{dataInfo?.mt5_deal_id}</span>
              </p>

              <p>
                Created At:&nbsp;
                <span className="text-primary">
                  {formatIST(dataInfo?.created_at as string)}
                </span>
              </p>
              <p>
                Completed At:&nbsp;
                <span className="text-primary">
                  {formatIST(dataInfo?.created_at as string)}
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
          </>
        )}

        {/* <p className="text-center"> <span className="text-primary">{dataInfo?.comment}</span></p> */}
      </Modal>
      <HistoryList
        title="MT5 to Wallet"
        isLoading={isLoading}
        rows={(data || []).map((item: any): HistoryRow => ({ id: item.transfer_id, label: "Transfer to Wallet", sub: item.mt5_login ? `MT5 ${item.mt5_login}` : undefined, date: item.created_at, amount: item.amount, currency: item.currency || "USD", status: item.status, direction: "in", raw: item }))}
        onInfo={(r) => {
          setId(r.raw.transfer_id);
          setIsOpen(true);
        }}
      />
    </>
  );
};

export default Mt5ToWalletHistory;
