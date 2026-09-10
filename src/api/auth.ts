"use client";
import axiosInstance from "@/utils/axios";
import axios from "axios";
import { Services } from "@/constants/apiServices";

export const register = async (data: {
  email: string;
  password: string;
  name?: string;
}) => {
  return await axios.post(`/proxy${Services.AUTH}/signup`, data, {
    withCredentials: true,
  });
};

export const login = async (data: { email: string; password: string }) => {
  return await axios.post(`/proxy${Services.AUTH}/login`, data, {
    withCredentials: true,
  });
};

export const verifyOtp = async (data: { code: string; email: string }) =>
  await axiosInstance().post(`${Services.AUTH}/verify`, data, {
    withCredentials: true,
  });

export const resendOtpApi = async (data: { email: string }) => {
  const { data: res } = await axiosInstance().post(
    `${Services.AUTH}/resend-verification?email=${data.email}`,
    { withCredentials: true },
  );
  return { data: res.data, success: res.success };
};

export const OAuthLogin = async (token: string, provider: string) => {
  return await axios.post(`/proxy${Services.AUTH}/auth/oauth-login`, {
    token,
    provider,
  });
};

export const forgetPasswordApi = async (data: any) => {
  const { data: response } = await axios.post(
    `/proxy${Services.AUTH}/forgot-password`,
    data,
    { withCredentials: true },
  );
  return response;
};

export const conformPasswordApi = async (data: {
  token: string;
  newPassword: string;
  repeat_password: string;
}) => {
  const { data: response } = await axios.post(
    `/proxy${Services.AUTH}/reset-password`,
    {
      reset_token: data.token,
      new_password: data.newPassword,
      repeat_password: data.repeat_password,
    },
    { withCredentials: true },
  );
  return response;
};

export const getUserProfile = async () => {};

// /api/v1/auth/verify-reset-code

export const verifyResetCode = async (data: { code: string; email: string }) =>
  await axiosInstance().post(`${Services.AUTH}/verify-reset-code`, data, {
    withCredentials: true,
  });

// /api/v1/auth/resend-reset-code

export const resendResetCodeApi = async (data: { email: string }) => {
  const { data: res } = await axiosInstance().post(
    `${Services.AUTH}/resend-reset-code`,
    data,
    { withCredentials: true },
  );
  return { data: res.data, success: res.success };
};
