import { Icons } from "@/components/icons";

export interface NavItem {
    title: string;
    url: string;
    disabled?: boolean;
    external?: boolean;
    shortcut?: [string, string];
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
    isActive?: boolean;
    badge?: string;
    items?: NavItem[];
}



export type TransactionStatus = 'completed' | 'processing' | 'rejected' | 'approved';
export type TransactionType = 'withdrawal' | 'deposit';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    currency: string;
    status: TransactionStatus;
    created_at: string;
    approved_at: string | null;
    completed_at: string | null;
}

export interface StatusSummary {
    total_amount: number;
    count: number;
}

export interface WalletData {
    user_id: string;
    wallet_balance: number;
    hold_balance: number;
    available_balance: number;
    total_balance: number;
    deposits: {
        by_status: {
            approved: StatusSummary;
            rejected: StatusSummary;
        };
        total_approved: number;
    };
    withdrawals: {
        by_status: {
            completed: StatusSummary;
            processing: StatusSummary;
            rejected: StatusSummary;
        };
        total_completed: number;
    };
    currency: string;
    kyc_status: string;
    last_updated: string;
}


export interface IPaginationParams {
    skip?: number;
    limit?: number;
    search?: string;
}