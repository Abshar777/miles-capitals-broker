// ── Intent-based responses (current flow) ────────────────────────────────────

export type TCoinsbayIntentCreateResponse = {
  intent_id: string;
  checkout_url: string;
  amount: number;
  currency: string;
  status: "created";
  expires_at: string;
};

export type TCoinsbayIntentStatus =
  | "created"
  | "paid"
  | "expired"
  | "cancelled"
  | "failed";

export type TCoinsbayIntentStatusResponse = {
  intent_id: string;
  status: TCoinsbayIntentStatus;
  amount: number;
  currency: string;
  checkout_url: string;
  expires_at: string;
  deposit_id: string | null; // populated once status = "paid"
};

// ── Legacy deposit response (kept for backwards compat) ──────────────────────

export type TCoinsbayDepositStatusApiResponse = {
  deposit_id: string;
  status: string;
  gateway_status: string;
  amount: number;
  currency: string;
  created_at: string;
  approved_at: string | null;
  payment_url: string;
};
