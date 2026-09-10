import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useQueryData } from "./useQueryData"
import { getAvailableCurrencies, getPaymentOptions } from "@/api/paymentOptions"
import { IPaymentOption } from "@/types/api.response"

export const useGetPaymentOptions = (currency: string) => {
    const { data: session } = useSession()
    const [paymentOptions, setPaymentOptions] = useState<IPaymentOption[]>([])
    const { data, isLoading, error, refetch, isRefetching,dataUpdatedAt } = useQueryData(['payment-options',currency], () => getPaymentOptions(session?.user?.token as string, currency),{enabled:!!currency&&currency?.trim()!=""})

    useEffect(() => {
        if (data) {
            setPaymentOptions((data as any).payment_options as IPaymentOption[])
        }
    }, [data])

    useEffect(() => {
       if(currency) {
        refetch()
       }
    }, [currency])
    return { paymentOptions, isLoading, error, isRefetching,dataUpdatedAt }

}

export const useGetAvailableCurrencies = () => {
    const { data: session } = useSession()
    const [currencies, setCurrencies] = useState<string[]>([])
    const { data, isLoading, error, isRefetching } = useQueryData(['available-currencies'], () => getAvailableCurrencies(session?.user?.token as string))

    useEffect(() => {
        if (data) {
            setCurrencies((data as any).currencies as string[])
        }
    }, [data])

   
    return { currencies, isLoading, error, isRefetching }

}