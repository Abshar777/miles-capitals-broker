import { useMutationData } from "./useMutation"
import { useZodFormV2 } from "./useZodForm"
import { kycSchemaType, kycSchema } from "@/schema/kyc/kyc.schema"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { AxiosError } from "axios"
import { fromCurrencies, paymentMethods } from "@/constants/curency"
import { fetchExchangeRates } from "@/api/utils"
import { useQueryData } from "./useQueryData"
import { getKYCDocuments, kyc } from "@/api/kyc"
import { toast } from "sonner"
import { TKYCDocumentApiResponse } from "@/types/api.response"
import { queryClient } from "@/components/providers/react-query"


export const useKyc = () => {
    const { data: session } = useSession()
    const router=useRouter()
    const { mutate, isPending, error } = useMutationData(['kyc'], (data: any) => kyc(data, session?.user?.token as string), ["kyc"], async () => {
        toast.success("KYC submitted successfully",{
            description:"Please wait for the verification process to complete",
            duration:10000
        })
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["kyc-documents"], exact: false }),
            queryClient.invalidateQueries({ queryKey: ["client-counts"], exact: false }),
        ])
        router.push("/root/verification")
        form.reset()
    })
    const { form, onFormSubmit, errors } = useZodFormV2(kycSchema, (data: any) => mutate(data), {
        identity_name: "aadhar",
        residency_name: "proof_of_residency",
    } as any)
    return { form, onFormSubmit, errors, isPending, error }
}



export const useGetKYCDocuments = () => {
    const { data:session } = useSession()
    const [kycDocuments, setKYCDocuments] = useState<TKYCDocumentApiResponse[]>([])
    const { data, isLoading, error } = useQueryData(['kyc-documents'], () => getKYCDocuments(session?.user?.token as string))
    useEffect(() => {
        if (data) {
            setKYCDocuments(data as TKYCDocumentApiResponse[])
        }
    }, [data])
    return { kycDocuments, isLoading, error }
}


