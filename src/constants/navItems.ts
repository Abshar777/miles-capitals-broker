import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/root/dashboard",
    icon: "dashboard",
  },
  {
    title: "Wallets",
    url: "/root/wallets",
    icon: "wallet",
  },
  {
    title: "MT5",
    url: "/root/mt5",
    icon: "mt5",
  },
  {
    title: "Funds",
    url: "/root/funds",
    icon: "funds",
    items: [
      {
        title: "Deposit",
        url: "/root/funds/deposit",
        icon: "funds",
      },
      {
        title: "Withdraw",
        url: "/root/funds/withdraw",
        icon: "funds",
      },
      {
        title: "Transfer",
        url: "/root/funds/transfer",
        icon: "funds",
      },
      {
        title: "MT5 to Wallet",
        url: "/root/funds/mt5-wallet",
        icon: "funds",
      },
      // MT5 to MT5 temporarily disabled
      // {
      //   title: "MT5 to MT5",
      //   url: "/root/funds/mt5-mt5",
      //   icon: "funds",
      // },
      {
        title: "Internal Transfer",
        url: "/root/funds/internal-transfer",
        icon: "funds",
      },
    ],
  },
  {
    title: "Transaction History",
    url: "/root/transactions",
    icon: "transactions",
  },
  {
    title: "Helpdesk",
    url: "/root/support",
    icon: "helpDesk",
    badge: "New",
  },
  {
    title: "IB Room",
    url: "/root/ib-room",
    icon: "ibRoom",
  },
];
