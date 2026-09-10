import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { cleanParams } from "@/lib/utils";

export const createMt5Acc = async (data: any, token: string) => {
  const isDemo = data.type?.toUpperCase() === "DEMO";
  const body: Record<string, any> = {
    leverage: data.leverage,
    currency: data.currency,
    first_name: data.firstname,
    last_name: data.lastname,
    credential_id: data.credentials_id,
    account_type: data.type.toUpperCase(),
    initial_balance: data.initial_balance || 0,
  };
  if (!isDemo) {
    body.account_category = data.account_type;
  }
  const response = await axiosInstance(token).post(`${Services.MT5}/accounts`, body);
  return response.data;
};

export const getAccDetails = async (
  token: string,
  login: string,
  credentialsId: string,
) => {
  console.log(token)
  const response = await axiosInstance(token).get(
    `${Services.MT5}/accounts/${login}?credential_id=${credentialsId}`,
  );
  return response.data;
};

export const getMt5AccList = async (
  token: string,
  accountType: string | undefined,
) => {
  const queryParams = new URLSearchParams();
  queryParams.append("limit", "500");
  if (accountType) {
    queryParams.append("account_type", accountType);
  }
  const response = await axiosInstance(token).get(
    `${Services.MT5}/accounts?${queryParams.toString()}`,
  );
  return response.data;
};

export const transferFunds = async (
  data: any,
  token: string,
  credentialsId: string,
) => {
  const response = await axiosInstance(token).post(`${Services.MT5}/deposit`, {
    user_login: data.account_id,
    deposit_amount: data.amount,
    comment: "Deposit",
    credential_id: credentialsId,
  });
  return response.data;
};

export const getUserIdValid = async (token: string, userId: string) => {
  const response = await axiosInstance(token).get(
    `${Services.USERS}/find-by-id/${userId}`,
  );
  return response.data;
};

export const getUserByEmail = async (token: string, email: string) => {
  const response = await axiosInstance(token).get(
    `${Services.USERS}/find-by-email/${encodeURIComponent(email.trim().toLowerCase())}`,
  );
  return response.data;
};

export const getMt5Balance = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.MT5}/wallet-balance`,
  );
  return response.data;
};

export const getMt5DepositHistory = async (token: string, params: any = {}) => {
  const cleanedParams = cleanParams(params);
  const response = await axiosInstance(token).get(
    `${Services.MT5}/deposit-history`,
    {
      params: cleanedParams,
    },
  );
  return response.data;
};

export const getMt5Credentials = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.MT5}/credentials`,
  );
  return response.data;
};

export const mT5ToMT5Transfer = async (
  data: any,
  token: string,
  credentialsId: string,
) => {
  const response = await axiosInstance(token).post(
    `${Services.MT5}/internal-transfer`,
    {
      credential_id: credentialsId,
      source_login: data.source_login,
      destination_login: data.destination_login,
      amount: data.amount,
      comment: "Internal Transfer",
    },
  );
  return response.data;
};

export const mT5ToMt5TransferHistory = async (
  token: string,
  params: any = {},
) => {
  const cleanedParams = cleanParams(params);
  const response = await axiosInstance(token).get(
    `${Services.MT5}/internal-transfer/history`,
    {
      params: cleanedParams,
    },
  );
  return response.data;
};

export const internalTransfer = async (
  data: any,
  token: string,
  credentialsId: string,
) => {
  const response = await axiosInstance(token).post(
    `${Services.MT5}/internal-transfer1`,
    {
      credential_id: credentialsId,
      source_login: data.source_login,
      destination_login: data.destination_login,
      amount: data.amount,
      comment: "Internal Transfer",
    },
  );
  return response.data;
};

export const mt5ToWalletTransfer = async (
  data: any,
  token: string,
  credentialsId: string,
) => {
  const response = await axiosInstance(token).post(
    `${Services.MT5}/transfer-to-wallet`,
    {
      credential_id: credentialsId,
      mt5_login: data.account_id,
      amount: data.amount,
      currency: "USD",
    },
  );
  return response.data;
};

export const getMt5TransferToWalletHistory = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.MT5}/transfer-to-wallet/history`,
  );
  return response.data;
};

export const getMt5Groups = async (token: string, credentialsId: string) => {
  const response = await axiosInstance(token).get(
    `${Services.MT5}/account-categories`,
  );
  return response.data;
};

export const getMt5ToWalletTransferByID = async (
  token: string,
  transferId: string,
) => {
  const response = await axiosInstance(token).get(
    `${Services.MT5}/transfer-to-wallet/${transferId}`,
  );
  return response.data;
};

export const updateLavrage = async (token: string, data: any) => {
  const response = await axiosInstance(token).post(
    `${Services.MT5}/accounts/update-leverage`,
    data,
  );
  return response.data;
};


// /api/v1/mt5/accounts/reset-password

export const resetMt5Password = async (token: string, data: any) => {
  const response = await axiosInstance(token).post(
    `${Services.MT5}/accounts/reset-password`,
    data,
  );
  return response.data;
};