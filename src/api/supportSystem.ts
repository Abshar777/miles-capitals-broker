"use client";
import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";
import { IPaginationParams } from "@/types";
import { cleanParams } from "@/lib/utils";

export const raiseTicket = async (token: string, data: any) => {
  const formData = new FormData();
  formData.append("subject", data.subject);
  formData.append("message", data.message);
  if (data.attachment) formData.append("attachment", data.attachment);
  const response = await axiosInstance(token).post(
    `${Services.SUPPORT}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const getTickets = async (token: string, params: any = {}) => {
  const cleanedParams = cleanParams(params);
  const response = await axiosInstance(token).get(`${Services.SUPPORT}`, {
    params: cleanedParams,
  });
  return response.data;
};

export const getTicketById = async (token: string, id: string) => {
  const response = await axiosInstance(token).get(`${Services.SUPPORT}/${id}`);
  return response.data;
};

export const sendMessage = async (token: string, id: string, data: any) => {
  const formData = new FormData();
  formData.append("message", data.message);
  if (data.attachment) formData.append("attachment", data.attachment);
  const response = await axiosInstance(token).post(
    `${Services.SUPPORT}/${id}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const readMessage = async (token: string, id: string) => {
  const response = await axiosInstance(token).post(
    `${Services.SUPPORT}/${id}/read`,
  );
  return response.data;
};
