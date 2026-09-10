// /api/v1/mt5/all-transfers

import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";

export const getAllTransfers = async (token: string, params: any) => {
  const cleanedParams = cleanParams(params);
  const response = await axiosInstance(token).get(
    `${Services.MT5}/all-transfers?${cleanedParams}`,
  );
  return response.data;
};

export const getMt5ToWalletHistory = async (token: string, params: any) => {
  const cleaned = cleanParams({ ...params, transfer_type: "mt5_to_wallet" });
  const response = await axiosInstance(token).get(
    `${Services.MT5}/all-transfers`,
    { params: cleaned },
  );
  return response.data;
};



