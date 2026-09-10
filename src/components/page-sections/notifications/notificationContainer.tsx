"use client";
import { Icon } from "@/components/ui/icon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications, useReadAllNotifications } from "@/hooks/useNotification";
import { cn, formatIST } from "@/lib/utils";
import { TNotificationApiResponse } from "@/types/api.response";
import { Spinner } from "@heroui/react";
import React from "react";
import NotificationReadButton from "./notificationReadButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagChip } from "@/components/ui/tag-chip";

const typeLabel = (type: TNotificationApiResponse["type"]) => {
  switch (type) {
    case "DEPOSIT_APPROVED":
      return "Deposit approved";
    case "DEPOSIT_REJECTED":
      return "Deposit rejected";
    case "WITHDRAWAL_APPROVED":
      return "Withdrawal approved";
    case "WITHDRAWAL_REJECTED":
      return "Withdrawal rejected";
    case "KYC_APPROVED":
      return "KYC approved";
    case "KYC_REJECTED":
      return "KYC rejected";
    case "WALLET_TRANSFER_APPROVED":
      return "Wallet transfer approved";
    case "WALLET_TRANSFER_REJECTED":
      return "Wallet transfer rejected";
    case "WALLET_TRANSFER_PENDING":
      return "Wallet transfer pending";
    default:
      return "Notification";
  }
};

const groupLabel = (type: string) => {
  const g = type.split("_")[0];
  return g === "KYC" ? "Verification" : g === "WALLET" ? "Transfer" : g.charAt(0) + g.slice(1).toLowerCase();
};

/** Reference notifications panel: underline tabs, rows of title / body / date + group chip. */
const NotificationContainer = () => {
  const { data, isLoading, unreadCount, isRefetching, activeTab, setActiveTab } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useReadAllNotifications();
  const busy = isLoading || isRefetching;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "new" | "read" | "all")} className="flex-1">
          <TabsList>
            <TabsTrigger value="new" className="gap-2">
              New
              {unreadCount > 0 && (
                <span className="inline-flex h-4 items-center rounded-[30px] bg-destructive px-1.5 text-[10px] leading-4 text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        {unreadCount > 0 && activeTab === "new" && (
          <button
            type="button"
            disabled={isMarkingAllAsRead}
            onClick={() => {
              markAllAsRead({});
              setActiveTab("all");
            }}
            className="h-12 text-[15px] leading-6 text-primary hover:text-primary-hover whitespace-nowrap disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <ScrollArea className="h-[70vh]">
        {busy && (
          <div className="flex items-center h-40 w-full justify-center">
            <Spinner color="primary" />
          </div>
        )}
        {!busy && data.length === 0 && (
          <div className="h-[200px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="size-10 rounded-full bg-field inline-flex items-center justify-center">
              <Icon name="no-data-16" size={16} />
            </span>
            <span className="text-[15px] leading-6">No notifications</span>
          </div>
        )}
        {!busy && (
          <div className="flex flex-col">
            {data.map((n) => (
              <div key={n.id.toString()} className="flex gap-3 py-4 border-b border-border last:border-0">
                <span className={cn("mt-2 size-2 rounded-full shrink-0", n.is_read ? "bg-transparent" : "bg-primary")} />
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[15px] leading-6 text-foreground">{typeLabel(n.type)}</span>
                    {!n.is_read && <NotificationReadButton notification={n} />}
                  </div>
                  <p className="text-[15px] leading-6 text-muted-foreground">{n.message}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] leading-4 text-muted-foreground">
                      {n.created_at && formatIST(n.created_at, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <TagChip>{groupLabel(n.type)}</TagChip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default NotificationContainer;
