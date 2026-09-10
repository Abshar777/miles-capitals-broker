import { Services } from "@/constants/apiServices"
import AxiosInstance from "@/utils/axios"

export const uploadFile = async (file: File) => {
    return {
        success: true,
        url: "https://www.google.com",
    }
}

export const getUser = async (token: string) => {
    const { data } = await AxiosInstance(token).get(`${Services.AUTH}/profile`)
    return data
}

