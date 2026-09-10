import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";

export const withdraw = async (
  data: { amount: number; currency: string; withdrawal_method: string },
  token: string,
) => {
  const newData = {
    amount: data.amount,
    currency: data.currency,
    withdrawal_method: data.withdrawal_method,
  };
  return await axiosInstance(token).post(
    `${Services.WITHDRAW}/request`,
    newData,
  );
};

export const withdrawBankTransfer = async (
  data: {
    amount: number;
    currency: string;
    bank_name: string;
    account_number: string;
    account_holder_name: string;
    bank_swift_code: string;
    bank_routing_number: string;
    bank_ifsc_code: string;
    bank_branch: string;
  },
  token: string,
) => {
  const newData = {
    ...data,
    amount: data.amount,
    currency: data.currency,
  };
  return await axiosInstance(token).post(`${Services.WITHDRAW}/bank`, newData);
};

export const withdrawCrypto = async (
  data: {
    amount: number;
    currency: string;
    crypto_address: string;
    crypto_amount: number;
    network: string;
  },
  token: string,
) => {
  const newData = {
    ...data,
    amount: data.amount,
    currency: data.currency,
  };
  return await axiosInstance(token).post(
    `${Services.WITHDRAW}/crypto`,
    newData,
  );
};

export const withdrawCash = async (
  data: {
    amount: number;
    currency: string;
    collector_id_type: string;
    collector_id_number: string;
    collector_name: string;
    collection_location: string;
  },
  token: string,
) => {
  const newData = {
    ...data,
    amount: data.amount,
    currency: data.currency,
  };
  return await axiosInstance(token).post(`${Services.WITHDRAW}/cash`, newData);
};

export const getWithdrawHistory = async (token: string, params: any = {}) => {
  const cleanedParams = cleanParams(params);
  const { data } = await axiosInstance(token).get(
    `${Services.WITHDRAW}s/dynamic/history`,
    { params: cleanedParams },
  );
  return data;
};

export const cancelWithdrawal = async (withdrawalId: string, token: string) => {
  const { data } = await axiosInstance(token).post(
    `${Services.WITHDRAW}/${withdrawalId}/cancel`,
  );
  return data;
};

export const getWithdrawalTypes = async (token: string) => {
  const { data } = await axiosInstance(token).get(`${Services.WITHDRAW}/types`);
  return data;
};

export const createWithdrawal = async (
  data: {
    amount: number;
    currency: string;
    withdrawal_type_id: string;
    withdrawal_name: string;
    details: any;
  },
  token: string,
) => {
  const newData = {
    amount: data.amount,
    currency: data.currency,
    withdrawal_type_id: data.withdrawal_type_id,
    withdrawal_name: data.withdrawal_name,
    details: {
      ...data.details,
    },
  };
  return await axiosInstance(token).post(`${Services.WITHDRAW}s`, newData);
};
