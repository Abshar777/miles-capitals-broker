export interface IAllTransfersData {
  status: string;
  user_id: string;
  summary: {
    total_wallet_to_wallet: number;
    total_wallet_to_mt5: number;
    total_mt5_to_wallet: number;
    total_mt5_to_mt5: number;
    wallet_to_wallet_count: number;
    wallet_to_mt5_count: number;
    mt5_to_wallet_count: number;
    mt5_to_mt5_count: number;
  };
  transfers: Array<{
    id: string;
    type: "wallet_to_mt5" | "mt5_to_mt5" | "wallet_to_wallet" | "mt5_to_wallet";
    description: string;
    amount: number;
    currency: string;
    status: "completed" | "rejected" | "pending";
    from_account: string;
    to_account: string;
    mt5_login: number | null;
    created_at: string;
    completed_at: string | null;
    metadata: {
      // Wallet to MT5 common fields
      mt5_deal_id?: number;
      withdrawal_id?: string;
      // MT5 to MT5 specific fields
      source_login?: number;
      destination_login?: number;
      source_deal_id?: number;
      destination_deal_id?: number;
      source_balance_before?: number;
      source_balance_after?: number | null;
      destination_balance_before?: number;
      destination_balance_after?: number;
      comment?: string;
      // Wallet to Wallet specific fields
      transfer_id?: string;
      from_user_id?: string;
      to_user_id?: string;
      from_user_name?: string;
      to_user_name?: string;
    };
  }>;
  total_count: number;
}