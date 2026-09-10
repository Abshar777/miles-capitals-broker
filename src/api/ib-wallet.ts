import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";
import { IPaginationParams } from "@/types";
import AxiosInstance from "@/utils/axios";

// /api/v1/ib/wallet/balance
export const getIbWalletBalance = async (token: string) => {
  const response = await AxiosInstance(token).get(
    `${Services.IB}/wallet/balance`,
  );
  return response.data;
};

// /api/v1/ib/wallet/transactions
export const getIbWalletTransactions = async (token: string, params: any) => {
  const cleanedParams = cleanParams(params);
  const response = await AxiosInstance(token).get(
    `${Services.IB}/wallet/transactions`,
    { params: cleanedParams },
  );
  return response.data;
};

// /api/v1/ib/wallet/commissions
export const getIbWalletCommissions = async (token: string,params:any) => {
  const cleanedParams = cleanParams(params);
  const response = await AxiosInstance(token).get(
    `${Services.IB}/wallet/commissions`,
    { params: cleanedParams },
  );
  return response.data;
};

// /api/v1/ib/wallet/commissions (export — no pagination cap)
export const exportIbWalletCommissions = async (token: string, params: any) => {
  const cleanedParams = cleanParams(params);
  const response = await AxiosInstance(token).get(
    `${Services.IB}/wallet/commissions`,
    { params: { ...cleanedParams, skip: 0, limit: 5000 } },
  );
  return response.data;
};

// /api/v1/ib/wallet/transfer-to-main
export const transferToMain = async (
  token: string,
  data: { amount: number },
) => {
  const response = await AxiosInstance(token).post(
    `${Services.IB}/wallet/transfer-to-main`,
    data,
  );
  return response.data;
};
