"use client";
import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export const submitFeedback = async (
  token: string,
  data: { rating: number; comment?: string },
) => {
  const response = await axiosInstance(token).post(Services.FEEDBACK, data);
  return response.data;
};
