import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";

export const getPrices = async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.PRICES}`)
    return data
}

export const getPrice = async (token: string,code:string) => {
    const { data } = await axiosInstance(token).get(`${Services.PRICES}/${code}`)
    return data
}