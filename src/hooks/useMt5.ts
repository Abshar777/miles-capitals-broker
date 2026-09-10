import { useMutation } from "@tanstack/react-query";
import { useMutationData } from "./useMutation";
import { toast } from "sonner";
import { useZodFormV2 } from "./useZodForm";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  createMt5Acc,
  getAccDetails,
  getMt5AccList,
  getMt5Balance,
  getMt5Credentials,
  getMt5Groups,
  resetMt5Password,
  updateLavrage,
} from "@/api/mt5";
import { mt5SchemaType, mt5Schema } from "@/schema/mt5/mt5.schema";
import { useMt5UiStore } from "@/store/mt5uiStore";
import { useModalStore } from "@/store/successModalUiStore";
import {
  TMT5AccountDetailsApiResponse,
  TMT5AccountListApiResponse,
  TMT5BalanceApiResponse,
} from "@/types/api.response";
import { queryClient } from "@/components/providers/react-query";
import { walletBalance } from "@/api/wallet";
import {
  leverageSchema,
  leverageSchemaType,
} from "@/schema/mt5/levrage.schema";

export const useCreateMt5Acc = ({ type }: { type: "Live" | "Demo" }) => {
  const { data: session } = useSession();
  const { setOpenModal } = useMt5UiStore();
  const [credentialsId, setCredentialsId] = useState<string>("");
  const { openSuccessModal, setData } = useModalStore();
  const { mutate, isPending } = useMutationData(
    ["mt5Create"],
    (data: mt5SchemaType) => createMt5Acc(data, session?.user.token || ""),
    ["mt5AccList"],
    (data: any) => {
      toast.success("Account created successfully");
      setOpenModal(false);
      setData(data);

      openSuccessModal(
        "Account created successfully",
        "Your account has been created successfully ",
      );
    },
  );
  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: credentialsError,
    refetch,
  } = useQueryData(
    ["mt5Credentials", type],
    () => getMt5Credentials(session?.user.token || ""),
    {
      enabled: type === "Live" || type === "Demo",
    },
  );
  const {
    data: groups,
    isPending: isPendingGroups,
    isFetched: isFetchedGroups,
    error: errorGroups,
    isSuccess: isSuccessGroups,
  } = useQueryData(
    ["mt5GroupsByCredentialId", credentialsId],
    () => getMt5Groups(session?.user?.token as string, credentialsId),
    {
      enabled: credentialsId.trim() !== "",
    },
  );
  useEffect(() => {
    if (credentials) {
      const list = credentials as {
        id: string;
        type_account: string;
        label: string;
        is_active: boolean;
      }[];
      // Demo uses the live credential (same server — group name decides demo vs live)
      const match =
        type === "Demo"
          ? list.find((c) => c.type_account?.toUpperCase() === "LIVE")
          : list.find((c) => c.type_account?.toUpperCase() === type.toUpperCase());
      setCredentialsId(match?.id || "");
    }
  }, [type, credentials]);
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    // Only auto-set account_type for live accounts; demo doesn't use a category
    if (
      type !== "Demo" &&
      groups &&
      (groups as any)?.data?.available_account_categories?.length > 0
    ) {
      form.setValue(
        "account_type",
        (groups as any)?.data?.available_account_categories?.[0] || "zero",
      );
    }
  }, [groups, type]);
  const { form, onFormSubmit, register, errors } = useZodFormV2(
    mt5Schema,
    (data: mt5SchemaType) =>
      mutate({ ...data, credentials_id: credentialsId, type }),
    {
      firstname: session?.user.name.split(" ")[0] || " ",
      lastname: session?.user.name.split(" ")[1] || " ",
      leverage: "100",
      account_type: "",
      currency: "USD",
      initial_balance: type === "Demo" ? 5000 : 0,
    },
  );
  useEffect(() => {
    // Only auto-set initial_balance for demo accounts;
    if (type === "Demo") {
      form.setValue("initial_balance", 5000);
    }
  }, [type]);
  return {
    form,
    onFormSubmit,
    register,
    errors,
    isPending,
    isPendingGroups,
    groups: (groups as any as {
      available_account_categories: string[];
    }) || { available_account_categories: [] },
  };
};

export const useGetMt5AccList = () => {
  const [accountType, setAccountType] = useState<string | undefined>(undefined);
  const { data: session } = useSession();
  const [length, setLength] = useState<number>(0);
  const [accounts, setAccounts] = useState<TMT5AccountListApiResponse[]>([]);
  const { data, isLoading, error, refetch, isRefetching } = useQueryData(
    ["mt5AccList",],   // include accountType so React Query re-fetches on filter change
    () => getMt5AccList(session?.user.token || "", accountType),
  );
  useEffect(() => {
    if (data) {
      setAccounts((data as any).items as TMT5AccountListApiResponse[]);
    }
  }, [data]);

  useEffect(() => {
    if (accounts.length > 0) {
      setLength(accounts.length);
    }
  }, [accounts]);

    useEffect(() => {
    refetch();
  }, [accountType]);

  return {
    data,
    isLoading,
    error,
    accounts,
    setAccountType,
    refetch,
    isRefetching:isLoading,
    length,
  };
};

export const useGetMt5AccDetails = () => {
  const { data: session } = useSession();
  const [accountDetails, setAccountDetails] =
    useState<TMT5AccountDetailsApiResponse | null>(null);
  const [login, setLogin] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [credentialsId, setCredentialsId] = useState<string>("");
  const {
    data: credentials,
    isLoading: isLoadingCredentials,
    error: credentialsError,
    refetch: refetchCredentials,
  } = useQueryData(
    ["mt5Credentials", type],
    () => getMt5Credentials(session?.user.token || ""),
    {
      enabled: true,
    },
  );
  useEffect(() => {
    if (credentials) {
      const id =
        (
          credentials as {
            id: string;
            type_account: string;
            label: string;
            is_active: boolean;
          }[]
        )?.find(
          (credential: any) => credential.type_account === type.toLowerCase(),
        )?.id || "";

      setCredentialsId(id);
    }
  }, [type, credentials]);
  const { data, isLoading, error, refetch, isRefetching } = useQueryData(
    ["mt5AccDetails", login, credentialsId],
    () => getAccDetails(session?.user.token || "", login, credentialsId),
    {
      enabled: login.trim() !== "",
    },
  );

  useEffect(() => {
    if (isRefetching || isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isRefetching, isLoading]);
  useEffect(() => {
    if (data) {
      setAccountDetails(data as any as TMT5AccountDetailsApiResponse);
    }
  }, [data]);

  useEffect(() => {
    if (login.trim() != "") {
      refetch();
    }
  }, [login]);

  return {
    data,
    isLoading,
    error,
    login,
    setLogin,
    refetch,
    loading,
    accountDetails,
    setType,
    type,
    credentialsId,
  };
};

export const useGetMt5CredList = () => {
  const [credList, setCredList] = useState<
    {
      id: string;
      type_account: string;
      label: string;
      is_active: boolean;
    }[]
  >([]);
  const { data: session } = useSession();
  const { data, isLoading, error, refetch } = useQueryData(
    ["mt5CredList"],
    () => getMt5Credentials(session?.user.token || ""),
  );
  useEffect(() => {
    if (data) {
      setCredList(
        data as {
          id: string;
          type_account: string;
          label: string;
          is_active: boolean;
        }[],
      );
    }
  }, [data]);
  return { data, isLoading, error, credList, refetch };
};

export const useGetMt5Balance = () => {
  const pathname = usePathname();
  const [balance, setBalance] = useState<TMT5BalanceApiResponse | null>(null);
  const { data: session } = useSession();
  const { data, isLoading, error, refetch } = useQueryData(["mt5Balance"], () =>
    walletBalance(session?.user.token || ""),
  );
  useEffect(() => {
    if (data) {
      setBalance(data as TMT5BalanceApiResponse);
    }
  }, [data]);
  useEffect(() => {
    if (pathname === "/funds") {
      refetch();
    }
  }, [pathname]);
  return { data, isLoading, error, balance };
};

export const useUpdateLavrage = (
  OLdlavrage: string,
  login: string,
  credID: string,
) => {
  const { data: session } = useSession();
  const { mutate, isPending, error } = useMutationData(
    ["updateLavrage"],
    (data: any) => updateLavrage(session?.user.token || "", data),
    ["mt5AccDetails"],
    async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mt5AccDetails"],
        exact: false,
      });
    },
  );
  const { form, onFormSubmit, register, errors } = useZodFormV2(
    leverageSchema,
    (data: leverageSchemaType) =>
      mutate({
        leverage: data.leverage,
        credential_id: credID,
        mt5_login: login,
      }),
    {
      leverage: OLdlavrage,
    },
  );
  return { mutate, isPending, error, form, onFormSubmit, register, errors };
};

export const useResetMt5Password = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error } = useMutationData(
    ["resetpasswordMt5"],
    (data: any) => resetMt5Password(session?.user.token || "", data),
    ["mt5AccDetails"],
    async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mt5AccDetails"],
        exact: false,
      });
    },
  );

  const onSubmit = (data: {
    mt5_login: number;
    password_type: "investor" | "master";
  }) => {
    mutate(data);
  };
  return { mutate, isPending, error, onSubmit };
};
