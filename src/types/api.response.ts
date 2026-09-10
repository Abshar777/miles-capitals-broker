export type TUserApiResponse = {
  created_at: string;
  email: string;
  firstname: string;
  id: string;
  is_verified: boolean;
  kyc_status: string;
  lastname: string;
  wallet_balance: string;
};

export type TDepositHistoryApiResponse = {
  currency: string;
  deposit_id: string;
  created_at: string; // ISO date string
  admin_notes: string | null;
  amount: number;
  user_id: string;
  receive_amount: number;
  status: "pending" | "approved" | "rejected"; // inferred from 'pending' — extend as needed
  approved_at: string | null; // ISO date string or null
  proof_deposit_image: string;
  payment_mode: string;
  created_by_admin_email: string | null;
  balance_after: number;
  balance_before: number;
  commission_amount?: number | null;
};

// admin_notes
// :
// "Admin Credit: Admin credit: aa"
// amount
// :
// 100
// approved_at
// :
// "2025-12-10T09:55:45.444741"
// balance_after
// :
// 185
// balance_before
// :
// 85
// created_at
// :
// "2025-12-10T09:55:45.444741"
// created_by_admin_email
// :
// "admin"
// currency
// :
// "USD"
// deposit_id
// :
// "788629"
// payment_mode
// :
// "admin_credit"
// payment_option_id
// :
// null
// proof_deposit_image
// :
// null
// receive_amount
// :
// 100
// source
// :
// "admin_credit"
// status
// :
// "approved"
// user_id
// :
// "1"

export type TWithdrawHistoryApiResponse = {
  admin_notes: string;
  amount: number;
  approved_at: string;
  completed_at: string;
  created_at: string;
  currency: string;
  details: Record<string, string>;
  group_name: string;
  status: string;
  withdrawal_id: string;
  withdrawal_method: string;
  withdrawal_name: string;
  withdrawal_type_id: string;
};

// {
//     "name": "string",
//     "description": "string",
//     "registration": "public",
//     "product": "string",
//     "currency": "USD",
//     "is_default": false,
//     "id": "string",
//     "created_at": "2025-12-21T07:29:16.334Z",
//     "updated_at": "2025-12-21T07:29:16.334Z"
//   }

export type TDefaultPlanApiResponse = {
  name: string;
  description: string;
  registration: string;
  product: string;
  currency: string;
  is_default: boolean;
  id: string;
  created_at: string;
  updated_at: string;
};

// approved_at
// :
// "2025-12-22T06:07:01.247605"
// plan_name
// :
// "aa"
// unique_ref_code
// :
// "ec387a9f-d327-4300-94d0-5f1cdf25a268"
// unique_url
// :
// "http://localhost:3000/register?referral=ec387a9f-d327-4300-94d0-5f1cdf25a268"

export type TMyRefralLinkApiResponse = {
  approved_at: string;
  plan_name: string;
  unique_ref_code: string;
  unique_url: string;
};

export type TMyClientsApiResponse = {
  ib_level: number;
  parent_ib_id: string;
  total_count: number;
  skip: number;
  limit: number;
  summary: {
    direct_clients_count: number;
    total_descendants_count: number;
  };
  clients: {
    country: string;
    direct_children_count: number;
    email: string;
    firstname: string;
    is_ib: boolean;
    joined_at: string;
    lastname: string;
    ib_commission_earned:number;
    reward_amount:number;
    total_volume:number;
    mt5_accounts:{
      login:number,
      balance:number,
    }[]
    level: 1;
    name: string;
    parent_user_id: string;
    phone: string;
    user_id: string;

  }[];
};

export type TIBStatusApiResponse = {
  is_ib: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED" | null;
  plan_name: string;
  unique_ref_code: string;
  unique_url: string;
  approved_at: string;
};

export type TWithdrawalTypeApiResponse = {
  id: string;
  type: string;
  currency: string;
  group_name: string;
  fields: {
    name: string;
    label: string;
    required: boolean;
    placeholder: string;
    help_text: string;
  }[];
  is_active: boolean;
  created_at: string;
};

export type TMT5AccountListApiResponse = {
  login: number;
  account_type: string;
  first_name: string;
  balance: number;
  last_name: string;
  created_at: string;
  account_category: string;
  leverage: number;
};

export enum PaymentType {
  BANK = "bank",
  CRYPTO = "crypto",
}

export interface IPaymentOption {
  id: string;
  type: PaymentType;
  currency?: string | null;
  group_name: string;
  is_active: boolean;
  created_at: string;
  provider: string;
  image?:string;
  updated_at: string;
  created_by?: string | null;
  parameters?: Record<string, string>;
  commission_percent?: number;
  commission_start_amount?: number;
}

export type TMT5AccountDetailsApiResponse = {
  balance: number;
  first_name: string;
  account_category: string;
  last_name: string;
  leverage: number;
  equity: number;
  login: number;
  master_password: string;
  investor_password: string;
};

export type TWalletBalanceApiResponse = {
  user_id: string;
  current_balance: number;
  total_approved_deposits: number;
  total_completed_withdrawals: number;
  currency: string;
  last_updated: string;
};

export type TMT5BalanceApiResponse = {
  available_balance: number;
  currency: string;
  current_balance: number;
  hold_balance: number;
  last_updated: string;
  total_approved_deposits: number;
  total_balance: number;
  total_completed_withdrawals: number;
};

export type TMT5DepositHistoryApiResponse = {
  deposits: TMT5DepositHistoryItemApiResponse[];
};

export type TMT5DepositHistoryItemApiResponse = {
  withdrawal_id: string;
  user_id: string;
  deposit_amount: number;
  currency: string;
  status: string;
  created_at: string;
  completed_at: string;
  mt5_login: number;
  deal_id: number;
  comment: string;
};

export type TMT5TransferToWalletHistoryItemApiResponse = {
  transfer_id: string;
  user_id: string;
  mt5_login: number;
  amount: number;
  currency: string;
  status: string;
  mt5_balance_before: number;
  mt5_balance_after: number;
  crm_balance_before: number;
  crm_balance_after: number;
  mt5_deal_id: number;
  admin_notes: string;
  created_at: string;
  reviewed_at: string;
  completed_at: string;
};

// "transfer_id": "string",
// "user_id": "string",
// "mt5_login": 0,
// "amount": 0,
// "currency": "string",
// "status": "string",
// "mt5_balance_before": 0,
// "mt5_balance_after": 0,
// "crm_balance_before": 0,
// "crm_balance_after": 0,
// "mt5_deal_id": 0,
// "admin_notes": "string",
// "created_at": "2025-11-27T12:16:58.109Z",
// "reviewed_at": "2025-11-27T12:16:58.109Z",
// "completed_at": "2025-11-27T12:16:58.109Z"

export type TTransferHistoryApiResponse = {
  transactions: TTransferHistoryItemApiResponse[];
};

export type TTransferHistoryItemApiResponse = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  approved_at: string;
  completed_at: string;
};

export type TKYCDocumentApiResponse = {
  id: string;
  document_type: string;
  document_name: string;
  status: string;
  uploaded_at: string;
  reviewed_at: string;
  admin_notes: string;
};

export type TWalletSummeryApiResponse = {
  user_id: string;
  available_balance: number;
  currency: string;
  kyc_status: string;
  last_updated: string;
  deposits: {
    by_status: {
      approved: {
        total_amount: number;
        count: number;
      };
      processing: {
        total_amount: number;
        count: number;
      };
      rejected: {
        total_amount: number;
        count: number;
      };
    };
    total_approved: number;
  };
  withdrawals: {
    by_status: {
      completed: {
        total_amount: number;
        count: number;
      };
      processing: {
        total_amount: number;
        count: number;
      };
      rejected: {
        total_amount: number;
        count: number;
      };
    };
    total_completed: number;
  };
};

export type TMT5ToMT5TransferHistoryApiResponse = {
  transfers: TMT5ToMT5TransferHistoryItemApiResponse[];
  total_count: number;
};

export type TWalletTransferHistoryApiResponse = {
  transfers: TWalletTransferHistory[];
  total_count: number;
};

export type TWalletTransferHistory = {
  transfer_id: string;
  from_user_id: string;
  from_user_name: string;
  to_user_id: string;
  to_user_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export type TMT5ToMT5TransferHistoryItemApiResponse = {
  transfer_id: string;
  source_login: number;
  destination_login: number;
  amount: number;
  comment: string;
  status: string;
  created_at: string;
  source_deal_id: number;
  destination_deal_id: number;
};

export type TNotificationApiResponse = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  meta: any;
  is_read: boolean;
  created_at: string;
};

export type TNotificationListApiResponse = {
  notifications: TNotificationApiResponse[];
  total_count: number;
  unread_count: number;
};

export type TUserProfileApiResponse = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  wallet_balance: string;
  kyc_status: string;
  is_verified: boolean;
  created_at: string;
};

// {
//   "status": "success",
//   "ib_id": "1",
//   "ib_name": "Mhd abshar",
//   "ib_email": "absharameen625@gmail.com",
//   "summary": {
//     "total_clients": 1,
//     "total_mt5_accounts": 3,
//     "total_trades": 2,
//     "total_volume": "0.02",
//     "total_profit": "230.00000000",
//     "total_commission": "0",
//     "total_swap": "0",
//     "net_profit": "230.00000000",
//     "clients_by_level": {
//       "0": 1
//     },
//     "trades_by_level": {
//       "0": 19
//     }
//   },
//   "trades": [
//     {
//       "client_user_id": "1",
//       "client_name": "Mhd abshar",
//       "client_email": "absharameen625@gmail.com",
//       "mt5_account_id": "985864",
//       "mt5_login": "9533459",
//       "account_type": "live",
//       "trade_id": 50,
//       "trade_ticket_id": 11595600,
//       "symbol": "EURMXN",
//       "trade_type": "buy",
//       "volume": "0.01",
//       "open_price": "22.50853000",
//       "close_price": "22.50853000",
//       "profit": "0",
//       "commission": "0",
//       "swap": "0",
//       "net_profit": "0",
//       "open_time": "2026-01-05T13:24:12",
//       "close_time": "2026-01-05T13:24:12",
//       "client_level": 0,
//       "is_direct_client": false
//     },
//     {
//       "client_user_id": "1",
//       "client_name": "Mhd abshar",
//       "client_email": "absharameen625@gmail.com",
//       "mt5_account_id": "985864",
//       "mt5_login": "9533459",
//       "account_type": "live",
//       "trade_id": 49,
//       "trade_ticket_id": 11595593,
//       "symbol": "EURAUD",
//       "trade_type": "buy",
//       "volume": "0.01",
//       "open_price": "1.74879000",
//       "close_price": "1.74879000",
//       "profit": "0",
//       "commission": "0",
//       "swap": "0",
//       "net_profit": "0",
//       "open_time": "2026-01-05T13:24:04",
//       "close_time": "2026-01-05T13:24:04",
//       "client_level": 0,
//       "is_direct_client": false
//     }
//   ],
//   "page": 1,
//   "limit": 50,
//   "total_pages": 1
// }

export type TIBSummaryApiResponse = {
  status: string;
  ib_id: string;
  ib_name: string;
  ib_email: string;
  summary: {
    total_clients: number;
    total_mt5_accounts: number;
    total_trades: number;
    total_volume: string;
    total_profit: string;
    total_commission: string;
    total_swap: string;
    net_profit: string;
    clients_by_level: {
      [key: string]: number;
    };
    trades_by_level: {
      [key: string]: number;
    };
  };
  trades: {
    client_user_id: string;
    client_name: string;
    client_email: string;
    mt5_account_id: string;
    mt5_login: string;
    account_type: string;
    trade_id: number;
    trade_ticket_id: number;
    symbol: string;
    trade_type: string;
    volume: string;
    open_price: string;
    close_price: string;
    profit: string;
    commission: string;
    swap: string;
    net_profit: string;
    open_time: string;
    close_time: string;
    client_level: number;
    is_direct_client: boolean;
  }[];
  page: number;
  limit: number;
  total_pages: number;
};
