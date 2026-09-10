export interface WalkthroughStep {
  id: string;
  target: string;
  title: string;
  description: string;
  emoji: string;
  position: "right" | "top" | "left" | "bottom";
  /** If true, click the Funds collapsible open before spotlighting */
  requiresFundsOpen?: boolean;
}

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "dashboard",
    target: '[data-tour="nav-dashboard"]',
    title: "Dashboard",
    description:
      "Your command center. See your wallet balance, MT5 account stats, recent activity, and quick metrics — all at a glance.",
    emoji: "📊",
    position: "right",
  },
  {
    id: "wallets",
    target: '[data-tour="nav-wallets"]',
    title: "Wallets",
    description:
      "Your CRM wallet holds all your funds. Deposited money lands here first before you move it to a trading account.",
    emoji: "💰",
    position: "right",
  },
  {
    id: "mt5",
    target: '[data-tour="nav-mt5"]',
    title: "MT5 Trading Accounts",
    description:
      "All your MetaTrader 5 accounts listed in one place. Monitor live balance, equity, margin level, and account type.",
    emoji: "📈",
    position: "right",
  },
  {
    id: "funds",
    target: '[data-tour="nav-funds"]',
    title: "Funds Hub",
    description:
      "Everything related to moving money lives here — deposits, withdrawals, and all transfer types between your wallets and MT5 accounts.",
    emoji: "🏦",
    position: "right",
  },
  {
    id: "deposit",
    target: '[data-tour="nav-deposit"]',
    title: "Deposit",
    description:
      "Add funds to your wallet. Choose a payment method, enter the amount, upload your payment proof and submit — our team approves it shortly.",
    emoji: "⬆️",
    position: "right",
    requiresFundsOpen: true,
  },
  {
    id: "withdraw",
    target: '[data-tour="nav-withdraw"]',
    title: "Withdraw",
    description:
      "Withdraw funds from your CRM wallet to your bank account or crypto wallet. Requests are reviewed and processed by our team.",
    emoji: "⬇️",
    position: "right",
    requiresFundsOpen: true,
  },
  {
    id: "wallet-mt5",
    target: '[data-tour="nav-wallet-mt5"]',
    title: "Wallet → MT5 Transfer",
    description:
      "Move funds instantly from your CRM wallet into your MT5 trading account so you can start trading.",
    emoji: "➡️",
    position: "right",
    requiresFundsOpen: true,
  },
  {
    id: "mt5-wallet",
    target: '[data-tour="nav-mt5-wallet"]',
    title: "MT5 → Wallet Transfer",
    description:
      "Pull profits or unused funds back from your MT5 trading account into your CRM wallet at any time.",
    emoji: "⬅️",
    position: "right",
    requiresFundsOpen: true,
  },
  {
    id: "internal",
    target: '[data-tour="nav-internal"]',
    title: "Internal Transfer",
    description:
      "Transfer funds between your own CRM wallets or between MT5 accounts instantly — no fees, no delays.",
    emoji: "🔄",
    position: "right",
    requiresFundsOpen: true,
  },
  {
    id: "transactions",
    target: '[data-tour="nav-transactions"]',
    title: "Transaction History",
    description:
      "A complete searchable log of every deposit, withdrawal, and transfer with live status updates.",
    emoji: "📋",
    position: "right",
  },
  {
    id: "ib-room",
    target: '[data-tour="nav-ib"]',
    title: "IB Room",
    description:
      "Your Introducing Broker hub. Track referrals, view earned commissions, monitor your IB plan, and see your full client hierarchy.",
    emoji: "🤝",
    position: "right",
  },
  {
    id: "support",
    target: '[data-tour="nav-support"]',
    title: "Support",
    description:
      "Need help? Open a ticket and chat with our support team directly. We respond to every query as quickly as possible.",
    emoji: "💬",
    position: "right",
  },
  {
    id: "profile",
    target: '[data-tour="user-card"]',
    title: "Your Profile",
    description:
      "Manage account details, complete KYC verification, update your security settings, and replay this tour any time.",
    emoji: "👤",
    position: "top",
  },
];
