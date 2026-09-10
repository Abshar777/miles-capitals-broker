import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export const applyIB = async (token: string, data: any) => {
  const response = await axiosInstance(token).post(
    `${Services.IB}/apply`,
    data,
  );
  return response.data;
};

export const getMyRefralLink = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.IB}/my-referral-link`,
  );
  return response.data;
};

export const getDefaultPlan = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.IB}/plans/default`,
  );
  return response.data;
};

export const getPlans = async (token: string) => {
  const response = await axiosInstance(token).get(
    `${Services.IB}/plans/public`,
  );
  return response.data;
};

// /api/v1/ib/claims/ref/{ref_code}

export const claimRefralApi = async (token: string, refCode: string) => {
  const response = await axiosInstance(token).get(
    `${Services.IB}/claims/ref/${refCode}`,
  );
  return response.data;
};

// /api/v1/ib/status

export const getIbStatus = async (token: string) => {
  const response = await axiosInstance(token).get(`${Services.IB}/status`);
  return response.data;
};

// /api/v1/ib/referrals/join

export const joinReferralApi = async (token: string, code: any) => {
  const response = await axiosInstance(token).post(
    `${Services.IB}/referrals/join`,
    {
      referral_code: code,
    },
  );
  return response.data;
};

// /api/v1/ib/my-clients

export const getMyClients = async (
  token: string,
  params: {
    skip?: number;
    limit?: number;
    search?: string;
    include_mt5_balances?: boolean;
  } = {},
) => {
  const response = await axiosInstance(token).get(
    `${Services.IB}/my-clients`,
    { params: { limit: 20, include_mt5_balances: true, ...params } },
  );
  return response.data;
};
// /api/v1/ib/mt5/trades
export const getMt5Trades = async (token: string) => {
  const response = await axiosInstance(token).get(`${Services.IB}/mt5/trades`);
  return response.data;
};
