"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const FundTabs = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || "";
  const query = accountId ? `?accountId=${accountId}` : "";
  const currentTab = pathname.split("/").pop() || "deposit";

  const tabs = [
    { label: "Deposit", value: "deposit", href: `/root/funds/deposit${query}` },
    { label: "Withdraw", value: "withdraw", href: `/root/funds/withdraw${query}` },
    { label: "Transfer", value: "transfer", href: `/root/funds/transfer${query}` },
    { label: "MT5 to Wallet", value: "mt5-wallet", href: `/root/funds/mt5-wallet${query}` },
    { label: "Internal Transfer", value: "internal-transfer", href: `/root/funds/internal-transfer${query}` },
  ];

  return (
    <Tabs value={currentTab}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default FundTabs;
