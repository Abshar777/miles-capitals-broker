import axiosInstance from "@/utils/axios";
import { Services } from "@/constants/apiServices";


export const getNotifications = async (token: string,isRead?:boolean) => {
    const queryParams = new URLSearchParams();
    if (isRead !== undefined) {
        queryParams.append('is_read', isRead.toString());
    }
    const { data } = await axiosInstance(token).get(`${Services.NOTIFICATION}?${queryParams.toString()}`)
    return data
}


export const readNotification = async (token: string,id:string) => {
    const { data } = await axiosInstance(token).post(`${Services.NOTIFICATION}/${id}/read`)
    return data
}


export const readAllNotifications = async (token: string) => {
    const { data } = await axiosInstance(token).post(`${Services.NOTIFICATION}/mark-all-read`)
    return data
}

export const getUnreadCount = async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.NOTIFICATION}/unread-count`)
    return data
}

export const deleteNotification = async (token: string,id:string) => {
    const { data } = await axiosInstance(token).delete(`${Services.NOTIFICATION}/${id}`)
    return data
}

export const getClientCounts = async (token: string) => {
    const { data } = await axiosInstance(token).get(`${Services.NOTIFICATION}/counts`)
    return data
}

