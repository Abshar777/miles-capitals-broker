import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

// ── Intent-based flow (current) ───────────────────────────────────────────────

// POST /api/v1/coinsbuy/create-intent
// Creates a PaymentIntent only — NO Deposit row until payment is confirmed
export const createCoinsbayIntent = async (
  token: string,
  data: { amount: number },
) => {
  const response = await axiosInstance(token).post(
    `${Services.COINSBUY}/create-intent`,
    data,
  );
  return response.data;
};

// GET /api/v1/coinsbuy/intent/{intent_id}/status
// Poll intent status; when status="paid", deposit_id is populated
export const getCoinsbayIntentStatus = async (
  token: string,
  intentId: string,
) => {
  const response = await axiosInstance(token).get(
    `${Services.COINSBUY}/intent/${intentId}/status`,
  );
  return response.data;
};

// ── Legacy (kept for backwards compat / admin manual flows) ──────────────────

// POST /api/v1/coinsbuy/create-deposit (deprecated — creates Deposit immediately)
export const createCoinsbayDeposit = async (token: string, data: any) => {
  const response = await axiosInstance(token).post(
    `${Services.COINSBUY}/create-deposit`,
    data,
  );
  return response.data;
};

// GET /api/v1/coinsbuy/deposit/{deposit_id}/status
export const getCoinsbayDepositStatus = async (
  token: string,
  depositId: string,
) => {
  const response = await axiosInstance(token).get(
    `${Services.COINSBUY}/deposit/${depositId}/status`,
  );
  return response.data;
};

// GET /api/v1/coinsbuy/wallets
export const getCoinsbayWallets = async (token: string) => {
  const response = await axiosInstance(token).get(`${Services.COINSBUY}/wallets`);
  return response.data;
};
