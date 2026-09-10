"use client";
import { container_variants, item_variants } from "@/constants/framer-motion";
import DepositeCard from "@/components/page-sections/funds/depositeCard";
import TransferCard from "@/components/page-sections/funds/transferCard";
import PageContainer from "@/components/providers/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DepoitHistory from "@/components/page-sections/funds/depositHistory";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import TransferHistory from "@/components/page-sections/funds/transferHistory";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useGetMt5Balance } from "@/hooks/useMt5";
import InternalTransferCard from "@/components/page-sections/funds/mt5ToMt5Card";
import InternalTransferHistory from "@/components/page-sections/funds/mt5ToMt5History";
import WithdrawCard from "@/components/page-sections/funds/withdrawCard";
import WithdrawHistory from "@/components/page-sections/funds/withdrawHistory";
import FundTabs from "@/components/page-sections/funds/fundstabs";

const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";
  const pathTab = pathname.split("/").pop();
  const tab = pathTab || "deposit";
  const [activeTab, setActiveTab] = useState(tab);
  useEffect(() => {
    router.replace("/root/funds/deposit")
  }, [])

  return (
    <>

    </>
  );
};

export default page;
