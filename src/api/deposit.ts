import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { IPaginationParams } from "@/types";
import { cleanParams } from "@/lib/utils";

export const deposit = async (
  data: {
    amount: number;
    to: string;
    file?: File[]; // proof images (up to 5)
    from: string;
    payment_mode: string;
    payment_option_id: string;
    receiveAmount: number;
    
  },
  token: string,
) => {
  console.log("anajnbaba")
  const formData = new FormData();
  formData.append("amount", data.amount.toString());
  formData.append("receive_amount", data.receiveAmount.toString());
  formData.append("currency", data.from);
  // Every proof image goes under the same field name; the backend accepts up to 5.
  for (const file of data.file ?? []) formData.append("proof_images", file);
  formData.append("payment_mode", data.payment_mode);
  formData.append("payment_option_id", data.payment_option_id);
  return await axiosInstance(token).post(
    `${Services.DEPOSIT}/deposit`,
    formData,
  );
};

export const getDepositeHistory = async (
  token: string,
  params: IPaginationParams & {
    status?: string;
    currency?: string;
    payment_mode?: string;
    date_from?: string;
    date_to?: string;
  } = {},
) => {
  const cleanedParams = cleanParams(params);
  const { data } = await axiosInstance(token).get(
    `${Services.DEPOSIT}/deposits/history`,
    { params: cleanedParams },
  );
  return data;
};

export const deleteDeposit = async (id: string, token: string) => {
  const { data } = await axiosInstance(token).delete(
    `${Services.DEPOSIT}/deposit/${id}`,
  );
  return data;
};
