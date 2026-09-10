import { useQueryData } from "./useQueryData";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { TNotificationApiResponse } from "@/types/api.response";
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  readAllNotifications,
  readNotification,
} from "@/api/notification";
import { useMutationData } from "./useMutation";
import { toast } from "sonner";
import { queryClient } from "@/components/providers/react-query";
import { useClientCounts } from "./useClientCounts";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<
    TNotificationApiResponse[]
  >([]);
  const [activeTab, setActiveTab] = useState<"new" | "read" | "all">("new");

  const [isRead, setIsRead] = useState<boolean | undefined>(false);
  const { data: session } = useSession();
  const { data, isLoading, isError, isSuccess, error, isRefetching, refetch } =
    useQueryData(["notifications"], () =>
      getNotifications(session?.user.token || "", isRead),
    );
  useEffect(() => {
    if (data) {
      setNotifications(
        (data as any).notifications as TNotificationApiResponse[],
      );
    }
  }, [data]);

  useEffect(() => {
    if (activeTab === "new") {
      setIsRead(false);
    } else if (activeTab === "read") {
      setIsRead(true);
    } else if (activeTab === "all") {
      setIsRead(undefined);
    }
  }, [activeTab]);

  useEffect(() => {
    console.log(isRead);
    refetch();
  }, [isRead]);

  return {
    data: notifications,
    isLoading,
    isError,
    isSuccess,
    error,
    unreadCount: (data as any)?.unread_count || 0,
    totalCount: (data as any)?.total_count || 0,
    isRefetching,
    activeTab,
    setActiveTab,
  };
};

export const useReadNotification = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error } = useMutationData(
    ["readNotification"],
    (id: string) => readNotification(session?.user.token || "", id),
    ["notifications"],
    async () => {
      toast.success("Notification marked as read");
      await queryClient.invalidateQueries({ queryKey: ["client-counts"], exact: false });
    },
  );
  return { mutate, isPending, error };
};

export const useReadAllNotifications = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error } = useMutationData(
    ["readAllNotifications"],
    () => readAllNotifications(session?.user.token || ""),
    ["notifications"],
    async () => {
      toast.success("All notifications marked as read");
      await queryClient.invalidateQueries({ queryKey: ["client-counts"], exact: false });
    },
  );
  return { mutate, isPending, error };
};

export const useGetUnreadCount = () => {
  const { notificationsUnread: count, isLoading } = useClientCounts();
  return { isLoading, count };
};

export const useDeleteNotification = () => {
  const { data: session } = useSession();
  const { mutate, isPending, error } = useMutationData(
    ["deleteNotification"],
    (id: string) => deleteNotification(session?.user.token || "", id),
    ["notifications"],
    async () => {
      toast.success("Notification deleted");
      await queryClient.invalidateQueries({ queryKey: ["client-counts"], exact: false });
    },
  );

  return { mutate, isPending, error };
};
