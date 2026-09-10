import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { getClientCounts } from "@/api/notification";

export const useClientCounts = () => {
  const { data: session } = useSession();
  const { data, isLoading } = useQueryData(
    ["client-counts"],
    () => getClientCounts(session?.user.token || ""),
    {
      enabled: !!session?.user.token,
      staleTime: 60_000,
      refetchInterval: 60_000,
    },
  );
  const counts = data as any;
  return {
    notificationsUnread: counts?.notifications_unread || 0,
    supportUnread: counts?.support_unread || 0,
    ibCommissions: counts?.ib_commissions || 0,
    isLoading,
  };
};
