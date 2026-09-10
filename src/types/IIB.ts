
export type TIBWalletCommissionApiResponse = {
  commissions: {
    id: string;
    trade_id: string;
    trader_id:string;
    trade_symbol: string;
    trade_type: string;
    trade_volume: number;
    trading_group_name: string;
    reward_per_lot: number;
    volume_lots: number;
    trade_reward_total: number;
    trader_email: string;
    mt5_login: string;
    level: number;
    ratio: number;
    amount: number;
    currency: string;
    status: string;
    wallet_credited: boolean;
    created_at: string;
  }[];
  total_count: number;
  skip: number;
  limit: number;
};

export type TIBWalletTransactionApiResponse = {
  transactions: {
    id: string;
    amount: number;
    transaction_type: string;
    description: string;
    balance_before: number;
    balance_after: number;
    reference_type: string;
    reference_id: string;
    currency: string;
    created_at: string;
  }[];
  total_count: number;
  skip: number;
  limit: number;
};

export type TIBWalletBalanceApiResponse = {
  balance: number;
  hold_balance: number;
  available_balance: number;
  total_earned: number;
  total_withdrawn: number;
  currency: string;
};
