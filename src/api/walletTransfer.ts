import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";

export const walletToWalletTransfer = async (data: any, token: string) => {
  const response = await axiosInstance(token).post(
    `${Services.WALLET_TRANSFERS}`,
    {
      to_user_email: data.destination_login,
      amount: data.amount,
      currency: "USD",
    },
  );
  return response.data;
};

export const walletTransferHistory = async (
  token: string,
  params: any = {},
) => {
  const cleanedParams = cleanParams(params);
  const response = await axiosInstance(token).get(
    `${Services.WALLET_TRANSFERS}/history`,
    {
      params: cleanedParams,
    },
  );
  return response.data;
};

export const cancelWalletTransfer = async (
  token: string,
  transferId: string,
) => {
  const response = await axiosInstance(token).post(
    `${Services.WALLET_TRANSFERS}/${transferId}/cancel`,
  );
  return response.data;
};
