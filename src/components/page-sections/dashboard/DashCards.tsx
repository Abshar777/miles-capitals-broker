"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { useGetMt5Balance } from "@/hooks/useMt5";
import { useTransferHistory } from "@/hooks/useTransfer";
import { useTransactionHistory, useWalletSummery } from "@/hooks/useWallet";
import { TWalletSummeryApiResponse } from "@/types/api.response";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import React, { useState } from "react";

const DashCards = ({ walletSummery, transferHistory, isWalletSummeryLoading, isTransferHistoryLoading }: { walletSummery: TWalletSummeryApiResponse | null, isWalletSummeryLoading: boolean, transferHistory: any, isTransferHistoryLoading: boolean }) => {
  const tabs: string[] = ["All", "Deposit", "Withdraw"];
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  // const { data, isLoading, isError, isSuccess, error } =
  //   useTransactionHistory();
  // const {data:transferHistory,isLoading}=useTransferHistory()
  // const { data: walletSummery,isLoading:isWalletSummeryLoading } = useWalletSummery();
  const router = useRouter();
  const { balance, isLoading: isMt5BalanceLoading } = useGetMt5Balance();
  return (
    <motion.div
      variants={container_variants}
      initial={"hidden"}
      animate={"visible"}
      className="w-full h-full grid lg:grid-cols-4 grid-cols-2 md:gap-4 gap-2  relative rounded-lg overflow-hidden"
    >
      <motion.div variants={item_variants}>
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>
              {" "}
              <h1 className="">Wallet Balance</h1>{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="-mt-5 w-full  flex ">
            {isMt5BalanceLoading && <Spinner size="sm" color="primary" />}
            <h1 className="text-primary md:text-2xl text-md  font-bold">
              {!isMt5BalanceLoading && balance?.available_balance ? balance?.available_balance : 0}&nbsp;
              {balance?.currency}
            </h1>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item_variants}>
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>
              {" "}
              <h1 className="">Total <br className="md:hidden block" />Deposits</h1>{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="-mt-5 w-full  flex ">
            {isTransferHistoryLoading && <Spinner size="sm" color="primary" />}
            {!isTransferHistoryLoading && <h1 className="text-primary md:text-2xl text-md  font-bold">
              {walletSummery?.deposits?.total_approved}&nbsp;
              {walletSummery?.currency}
            </h1>}
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item_variants}>
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>
              {" "}
              <h1 className="">Total Withdrawals</h1>{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="-mt-5 w-full  flex ">
            {isWalletSummeryLoading && <Spinner size="sm" color="primary" />}
            <h1 className="text-primary md:text-2xl text-md  font-bold">
              {!isWalletSummeryLoading && walletSummery?.withdrawals.total_completed}&nbsp;
              {walletSummery?.currency}
            </h1>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={item_variants}>
        <Card>
          {" "}
          <CardHeader>
            {" "}
            <CardTitle>
              {" "}
              <h1 className="">Total Transactions</h1>{" "}
            </CardTitle>{" "}
          </CardHeader>{" "}
          <CardContent className="-mt-5 w-full  flex ">
            {isTransferHistoryLoading && <Spinner size="sm" color="primary" />}
            <h1 className="text-primary md:text-2xl text-md  font-bold">
              {!isTransferHistoryLoading && transferHistory?.length}&nbsp;
            </h1>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashCards;
