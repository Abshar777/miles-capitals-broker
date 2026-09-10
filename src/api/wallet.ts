import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export const walletBalance = async (token: string) => {
    const response = await axiosInstance(token).get(`${Services.WALLET}/balance`)
    return response.data

}

export const walletSummery =async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.WALLET}/summary`)
    return data
}


export const trasferHistory = async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.WALLET}/transactions`)
    return data
}

export const getAllTransactions = async (token: string, limit = 20) => {
    const { data } = await axiosInstance(token).get(`${Services.WALLET}/all-transactions?limit=${limit}`)
    return data
}



