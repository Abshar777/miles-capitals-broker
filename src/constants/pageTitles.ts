/** Header title per route, longest prefix wins. Dashboard title is built from the user's name. */
export const PAGE_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/root/dashboard", title: "Dashboard" },
  { prefix: "/root/wallets", title: "Wallets" },
  { prefix: "/root/mt5", title: "MetaTrader 5" },
  { prefix: "/root/funds/deposit", title: "Deposit" },
  { prefix: "/root/funds/withdraw", title: "Withdraw" },
  { prefix: "/root/funds/transfer", title: "Transfer" },
  { prefix: "/root/funds/mt5-wallet", title: "MT5 to Wallet" },
  { prefix: "/root/funds/mt5-mt5", title: "MT5 to MT5" },
  { prefix: "/root/funds/internal-transfer", title: "Internal Transfer" },
  { prefix: "/root/funds", title: "Funds" },
  { prefix: "/root/transactions", title: "Transactions" },
  { prefix: "/root/ib-room", title: "IB Room" },
  { prefix: "/root/support", title: "Helpdesk" },
  { prefix: "/root/feedback", title: "Feedback" },
  { prefix: "/root/profile", title: "Profile Info" },
  { prefix: "/root/verification", title: "Verification" },
];

export const getPageTitle = (pathname: string): string => {
  const match = PAGE_TITLES.filter((p) => pathname.startsWith(p.prefix)).sort(
    (a, b) => b.prefix.length - a.prefix.length
  )[0];
  return match?.title ?? "";
};
