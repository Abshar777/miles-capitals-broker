import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";


export const getPaymentOptions = async (token: string,currency: string) => {
    const { data } = await axiosInstance(token).get(`${Services.PAYMENT_OPTIONS}?currency=${currency}`)
    return data
}

export const getAvailableCurrencies = async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.PAYMENT_OPTIONS}/currencies/list`)
    return data
}