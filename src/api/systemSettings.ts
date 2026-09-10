import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export interface ISystemSettings {
  min_deposit: number;
  min_withdrawal: number;
  max_withdrawal: number;
  currency: string;
  deposit_commission_percent: number;
  deposit_commission_start_amount: number;
}

export const getSystemSettings = async (token: string): Promise<ISystemSettings> => {
  const response = await axiosInstance(token).get(Services.SYSTEM_SETTINGS);
  return response.data;
};
