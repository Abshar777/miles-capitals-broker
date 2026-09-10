import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export const kyc = async (data: { identity_name: string, identity_front: File, identity_back: File, residency_name: string, residency_front: File, residency_back: File }, token: string) => {
    const formData = new FormData();
    formData.append("identity_name", data.identity_name);
    formData.append("identity_front", data.identity_front);
    formData.append("identity_back", data.identity_back);
    formData.append("residency_name", data.residency_name);
    formData.append("residency_front", data.residency_front);
    formData.append("residency_back", data.residency_back);

    return await axiosInstance(token).post(`${Services.KYC}/upload`, formData)
}

export const getKYCDocuments = async (token: string) => {
    const response = await axiosInstance(token).get(`${Services.KYC}/documents`)
    return response.data
}

