import { useSession } from "next-auth/react";
import { useClientCounts } from "./useClientCounts";
import { useRouter } from "next/navigation";
import { toast, useSonner } from "sonner";
import {
  raiseTicket,
  getTickets,
  getTicketById,
  sendMessage,
  readMessage,
} from "@/api/supportSystem";
import { useQueryData } from "./useQueryData";
import { useMutationData } from "./useMutation";
import { useZodFormV2 } from "./useZodForm";
import {
  raiseTicketSchema,
  sendMessageSchema,
} from "@/schema/support/support.schema";
import { TSupportTicketDetails, TTicketListResponse } from "@/types/ISupport";
import { useEffect, useRef, useState } from "react";

export const useRaiseTicket = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef=useRef<HTMLInputElement>(null)

  const { mutate, isPending } = useMutationData(
    ["raiseTicket"],
    (data: any) => raiseTicket(session?.user?.token as string, data),
    ["tickets"],
    (data) => {
      toast.success("Ticket raised successfully");
      router.push(`/root/support/${data.id}`);
    },
  );

  const { form, onFormSubmit, errors } = useZodFormV2(
    raiseTicketSchema,
    (data: any) => mutate(data),
    { subject: "", message: "" },
  );

  return { form, onFormSubmit, errors, isPending,fileInputRef };
};

export const useTickets = () => {
  const { data: session } = useSession();
  const [params, setParams] = useState<{ status: string }>({
    status: "all",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const updateParams = (key: "status", value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value || "all",
    }));
  };
  const { data, isLoading, isError, refetch } = useQueryData(
    ["tickets", Object.values(params)],
    () => getTickets(session?.user?.token as string, params),
    { enabled: !!session?.user?.token },
  );

  useEffect(() => {
    if (data && (data as any)?.total_count !== 0 && !isDataLoaded) {
      setIsDataLoaded(true);
    }
  }, [data]);

  return {
    tickets: (data as TTicketListResponse)?.tickets || [],
    total: (data as TTicketListResponse)?.total_count || 0,
    isLoading,
    isError,
    refetch,
    params,
    updateParams,
    isDataLoaded,
  };
};

export const useTicketDetails = (ticketId: string) => {
  const { data: session } = useSession();

  const { data, isLoading, isError } = useQueryData(
    ["ticket", ticketId],
    () => getTicketById(session?.user?.token as string, ticketId),
    {
      enabled: !!session?.user?.token && !!ticketId,
      refetchInterval: 30000,
    },
  );

  const { mutate: markAsRead } = useMutationData(
    ["readTicket", ticketId],
    () => readMessage(session?.user?.token as string, ticketId),
    ["ticket", ticketId],
    () => {
      toast.dismiss();
    },
  );

  useEffect(() => {
    if (data && (data as TSupportTicketDetails)?.unread_client_count > 0) {
      markAsRead({});
    }
  }, [(data as TSupportTicketDetails)?.id]);

  return {
    ticket: data as TSupportTicketDetails,
    isLoading,
    isError,
    markAsRead,
  };
};

export const useSendMesaage = (ticketId: string) => {
  const { data: session } = useSession();
  const fileInputRef=useRef<HTMLInputElement>(null)

  const { mutate: sendMsg, isPending: isSending } = useMutationData(
    ["sendMessage", ticketId],
    (payload: any) =>
      sendMessage(session?.user?.token as string, ticketId, payload),
    ["ticket", ticketId],
    () => {
      form.reset();
      toast.dismiss();
      toast.success("Message sent successfully");
    },
  );

  const { form, onFormSubmit, errors } = useZodFormV2(
    sendMessageSchema,
    (data: any) => sendMsg(data),
    { message: "" },
  );

  return {
    form,
    onFormSubmit,
    fileInputRef,
    errors,
    isSending,
  };
};

export const useUnreadSupportCount = () => {
  const { supportUnread: unreadCount } = useClientCounts();
  return { unreadCount };
};
