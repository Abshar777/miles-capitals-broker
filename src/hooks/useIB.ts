import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { TDefaultPlanApiResponse, TDepositHistoryApiResponse, TIBStatusApiResponse, TIBSummaryApiResponse, TMyClientsApiResponse, TMyRefralLinkApiResponse, TTransferHistoryItemApiResponse, TWalletBalanceApiResponse, TWalletSummeryApiResponse } from "@/types/api.response";
import { walletBalance, walletSummery, trasferHistory } from "@/api/wallet";
import { useEffect, useState } from "react";
import { applyIB, getDefaultPlan, getIbStatus, getMt5Trades, getMyClients, getMyRefralLink } from "@/api/ib";
import { useMutationData } from "./useMutation";
import { queryClient } from "@/components/providers/react-query";
import { toast } from "sonner";
import { useZodFormV2 } from "./useZodForm";
import { applyIBSchema } from "@/schema/ib/apply.schema";


export const useApplyIB = () => {
    const { data: session } = useSession();
    // get default plan
    const router = useRouter();

    const { data: defaultPlan, isLoading,isError } = useQueryData(['defaultPlan'], () => getDefaultPlan(session?.user.token || ""));
    const { mutate, isPending, error } = useMutationData(['applyIB'], (data:any) => applyIB(session?.user.token || "",data), ['ibStatus'], async () => {
        toast.success('IB applied successfully');
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["myIBPlan"],     exact: false }),
            queryClient.invalidateQueries({ queryKey: ["defaultPlan"],  exact: false }),
            queryClient.invalidateQueries({ queryKey: ["ibStatus"],     exact: false }),
            queryClient.invalidateQueries({ queryKey: ["client-counts"],exact: false }),
        ]);
    });

    const { form, errors, onFormSubmit } = useZodFormV2(applyIBSchema, (data: any) => mutate(data), {
        plan_id: "",
    });

    useEffect(() => {
        console.log((defaultPlan as any)?.registration);
        if (defaultPlan&&(defaultPlan as TDefaultPlanApiResponse).registration!=="private") {
            
            form.setValue('plan_id', (defaultPlan as TDefaultPlanApiResponse).id);
        }
    }, [defaultPlan]);
    return { form, errors, onFormSubmit, isPending, error, defaultPlan: defaultPlan as TDefaultPlanApiResponse | null, isLoading, isError }
}



export const useGetMyIBPlan = () => {
    const { data: session } = useSession();
    const { data: myIBPlan, isLoading, error, isError } = useQueryData(['myIBPlan'], () => getMyRefralLink(session?.user.token || ""));
    return { data: (myIBPlan as TMyRefralLinkApiResponse), isLoading, error, isError }
}


export const useGetIbStatus = () => {
    const { data: session } = useSession();
    const { data: ibStatus, isLoading, error, isError } = useQueryData(['ibStatus'], () => getIbStatus(session?.user.token || ""));
    return { data: (ibStatus as TIBStatusApiResponse), isLoading, error, isError }
}


export const useGetMyClients = () => {
    const { data: session } = useSession();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const LIMIT = 20;
    const skip = (page - 1) * LIMIT;

    const { data, isLoading, error, isError, refetch, isFetching } = useQueryData(
        ['myClients', page, search],
        () => getMyClients(session?.user.token || "", { skip, limit: LIMIT, search: search || undefined }),
        {
            enabled: !!session?.user.token,
            staleTime: 60_000,
            retry: 2,
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        }
    );

    const totalCount  = (data as any)?.total_count  ?? 0;
    const totalPages  = Math.max(1, Math.ceil(totalCount / LIMIT));

    return {
        data:       data as TMyClientsApiResponse,
        isLoading,
        isFetching,
        error,
        isError,
        refetch,
        page,
        setPage,
        search,
        setSearch,
        totalPages,
        totalCount,
        LIMIT,
    };
}


export const useGetIbTrades=() => {
    const { data: session } = useSession();
    const { data: myClients, isLoading, error, isError } = useQueryData(['ibTrades'], () => getMt5Trades(session?.user.token || ""));
    return { data: (myClients as TIBSummaryApiResponse), isLoading, error, isError }
}


export const useReferredClients = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const [params, setParams] = useState({
        is_ib: "all",
        date_from: "",
        date_to: "",
    });

    const updateParams = (key: keyof typeof params, value: string) => {
        setParams((prev) => ({ ...prev, [key]: value }));
        if (key === "date_from" || key === "date_to") {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set(key, value);
            router.push(`?${newParams.toString()}`);
        }
    };

    const { data, isLoading, error, isFetching } = useQueryData(
        ["referred-clients", Object.values(params).join("-"), skip, limit, search],
        () =>
            getMyClients(session?.user.token || "", {
                skip,
                limit,
                search: search || undefined,
                include_mt5_balances: true,
            }),
        {
            enabled: !!session?.user.token,
            staleTime: 60_000,
        }
    );

    const allClients = (data as TMyClientsApiResponse)?.clients ?? [];
    const filteredClients = params.is_ib === "all"
        ? allClients
        : allClients.filter((c) => (params.is_ib === "ib" ? c.is_ib : !c.is_ib));

    return {
        data: filteredClients,
        isLoading,
        isFetching,
        error,
        params,
        updateParams,
        total: (data as TMyClientsApiResponse)?.total_count ?? 0,
    };
};
