"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { item_variants } from "@/constants/framer-motion";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, copyToClipboard, formatIST } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { TMyClientsApiResponse } from "@/types/api.response";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LuHash,
  LuUser,
  LuGitBranch,
  LuLink,
  LuShield,
  LuCalendarDays,
  LuArrowRight,
  LuTrendingUp,
  LuWallet,
  LuChevronLeft,
  LuChevronRight,
  LuRefreshCw,
  LuSearch,
} from "react-icons/lu";
import { Spinner } from "@heroui/react";
import { MdOutlineContentCopy } from "react-icons/md";
import { FaCheck, FaXmark } from "react-icons/fa6";
import Link from "next/link";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

const AVATAR_COLORS = [
  "bg-primary",   "bg-rose-500",    "bg-emerald-500",
  "bg-blue-500",  "bg-amber-500",   "bg-violet-500",
  "bg-orange-500","bg-pink-500",    "bg-cyan-500",
];

function useAvatarColor() {
  return useCallback((id: string | number) => {
    let hash = 0;
    const s = String(id);
    for (let i = 0; i < s.length; i++) {
      hash = s.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }, []);
}

function ClientAvatar({
  firstname, lastname, userId, size = "sm",
}: { firstname: string; lastname: string; userId: string; size?: "sm" | "md" }) {
  const getColor = useAvatarColor();
  return (
    <Avatar className={size === "sm" ? "w-7 h-7" : "w-10 h-10"}>
      <AvatarFallback
        className={cn(getColor(userId), "text-white font-semibold",
          size === "sm" ? "text-[10px]" : "text-sm")}
      >
        {firstname.charAt(0).toUpperCase()}{lastname.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

/* ─── MT5 Accounts modal content ──────────────────────────────────────────── */

function Mt5AccountList({
  accounts,
}: { accounts: TMyClientsApiResponse["clients"][0]["mt5_accounts"] }) {
  if (!accounts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <LuWallet className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No MT5 accounts found</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {accounts.map((account) => (
        <div
          key={account.login}
          className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3"
        >
          <div className="flex items-center gap-2 text-sm">
            <LuWallet className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Login</span>
            <span className="font-semibold text-foreground">{account.login}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Balance</span>
            <span className="font-semibold text-primary">{account.balance}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Detail modal content ────────────────────────────────────────────────── */

function ClientDetailModal({
  client,
  isOpen,
  onClose,
}: {
  client: TMyClientsApiResponse["clients"][0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showAccounts, setShowAccounts] = useState(false);

  if (!client) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => { onClose(); setShowAccounts(false); }}
        title="Client Details"
        description={`Referral info for ${client.firstname} ${client.lastname}`}
      >
        <div className="flex flex-col gap-4">
          {/* Header row */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
            <ClientAvatar
              firstname={client.firstname}
              lastname={client.lastname}
              userId={client.user_id}
              size="md"
            />
            <div>
              <p className="font-semibold text-foreground">
                {client.firstname} {client.lastname}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-muted-foreground">ID #{client.user_id}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="h-4 w-4 p-0"
                  onClick={() => copyToClipboard(client.user_id ?? "")}
                >
                  <MdOutlineContentCopy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Badge
              variant={client.is_ib ? "success" : "secondary"}
              className="ml-auto"
            >
              {client.is_ib ? "IB" : "Client"}
            </Badge>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Volume", value: client.total_volume, icon: <LuTrendingUp className="w-3.5 h-3.5" /> },
              { label: "Commission", value: client.ib_commission_earned, icon: <LuWallet className="w-3.5 h-3.5" /> },
              { label: "Level", value: client.level ?? "—", icon: <LuGitBranch className="w-3.5 h-3.5" /> },
              { label: "Children", value: client.direct_children_count ?? 0, icon: <LuUser className="w-3.5 h-3.5" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl bg-muted/30 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {icon} {label}
                </div>
                <p className="font-bold text-foreground text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <LuLink className="w-3.5 h-3.5" /> Parent ID
              </span>
              <span className="font-medium">#{client.parent_user_id ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <LuCalendarDays className="w-3.5 h-3.5" /> Joined
              </span>
              <span className="font-medium">
                {formatIST(client.joined_at as string, { day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <LuWallet className="w-3.5 h-3.5" /> MT5 Accounts
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{client.mt5_accounts?.length ?? 0}</span>
                {(client.mt5_accounts?.length ?? 0) > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                    onClick={() => setShowAccounts(!showAccounts)}
                  >
                    {showAccounts ? "Hide" : "View"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Inline MT5 accounts */}
          {showAccounts && (
            <div className="rounded-xl border border-border/50 p-2">
              <Mt5AccountList accounts={client.mt5_accounts} />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */

const RefredFrinds = ({
  data,
  isLoading,
  isFetching,
  isError,
  refetch,
  page,
  setPage,
  search,
  setSearch,
  totalPages,
  totalCount,
  fullPage = false,
}: {
  data: TMyClientsApiResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  page: number;
  setPage: (p: number) => void;
  search: string;
  setSearch: (s: string) => void;
  totalPages: number;
  totalCount: number;
  fullPage?: boolean;
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState<TMyClientsApiResponse["clients"][0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const getColor = useAvatarColor();

  const openDetail = (client: TMyClientsApiResponse["clients"][0]) => {
    setSelected(client);
    setDetailOpen(true);
  };

  const clients = data?.clients ?? [];

  return (
    <>
      <ClientDetailModal
        client={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <motion.div
        className={cn(
          "w-full overflow-hidden",
          fullPage
            ? "min-h-[calc(100vh-220px)]"
            : "min-h-[75vh] max-h-[75vh] h-full",
        )}
        variants={item_variants}
      >
        <Card className="h-full w-full flex flex-col">
          {/* ── Header ── */}
          <CardHeader className="border-b border-border/40 shrink-0 py-3 px-4 space-y-2">
            <div className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-base">
                <LuGitBranch className="w-4 h-4 text-primary" />
                Referral Friends
                {totalCount > 0 && (
                  <Badge variant="secondary" className="text-xs font-normal ml-1">
                    {totalCount}
                  </Badge>
                )}
                {isFetching && !isLoading && (
                  <LuRefreshCw className="w-3 h-3 text-muted-foreground animate-spin ml-1" />
                )}
              </CardTitle>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => refetch()}
                  className="h-7 w-7 p-0"
                  title="Refresh"
                >
                  <LuRefreshCw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"

                  className="flex items-center gap-1.5 h-7 text-xs"
                >
                  <Link href="/root/ib-room?tab=clients" className="flex w-full items-center gap-1.5">
                    See more <LuArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
            </div>
            {/* Search */}
            <div className="relative">
              <LuSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name, email or ID…"
                className="w-full pl-8 pr-3 h-8 rounded-lg bg-muted/40 border border-border/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            {/* ── Loading ── */}
            {isLoading && (
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg bg-muted/50" />
                ))}
              </div>
            )}

            {/* ── Error + retry ── */}
            {!isLoading && isError && (
              <div className="flex flex-col h-full items-center justify-center gap-3 py-16">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <LuRefreshCw className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Failed to load clients
                </p>
                <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-1.5">
                  <LuRefreshCw className="w-3.5 h-3.5" /> Try again
                </Button>
              </div>
            )}

            {/* ── Empty ── */}
            {!isLoading && !isError && clients.length === 0 && (
              <div className="flex flex-col h-full items-center justify-center gap-3 py-16">
                <img
                  src="/svgs/nothing.svg"
                  alt="no referrals"
                  className="h-40 grayscale opacity-40 object-contain"
                />
                <p className="text-sm text-muted-foreground">
                  {search ? "No clients match your search" : "No referrals yet"}
                </p>
              </div>
            )}

            {/* ── Table ── */}
            {!isLoading && clients.length > 0 && (
              <ScrollArea className={cn(
                "h-full",
                fullPage ? "max-h-[calc(100vh-320px)]" : "max-h-[calc(75vh-60px)]",
              )}>
                {/* ─── Desktop table ─────────────────────────────────────── */}
                <div className="hidden md:block min-w-[640px]">
                  {/* Header */}
                  <div className="grid grid-cols-[60px_1fr_90px_90px_80px_80px_100px] gap-x-3 px-4 py-2 border-b border-border/30 bg-muted/20">
                    {[
                      { label: "ID",        icon: <LuHash className="w-3 h-3" /> },
                      { label: "Name",      icon: <LuUser className="w-3 h-3" /> },
                      { label: "Volume",    icon: <LuTrendingUp className="w-3 h-3" /> },
                      { label: "Earned",    icon: <LuWallet className="w-3 h-3" /> },
                      { label: "Parent",    icon: <LuLink className="w-3 h-3" /> },
                      { label: "Is IB",     icon: <LuShield className="w-3 h-3" /> },
                      { label: "Joined",    icon: <LuCalendarDays className="w-3 h-3" /> },
                    ].map(({ label, icon }) => (
                      <div key={label} className="flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {icon} {label}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className="flex flex-col">
                    {clients.map((client) => (
                      <button
                        key={client.user_id}
                        onClick={() => openDetail(client)}
                        className="grid grid-cols-[60px_1fr_90px_90px_80px_80px_100px] gap-x-3 px-4 py-3 items-center text-left border-b border-border/20 hover:bg-muted/30 transition-colors group"
                      >
                        {/* ID */}
                        <span className="text-xs text-muted-foreground font-mono">
                          #{client.user_id}
                        </span>

                        {/* Name */}
                        <div className="flex items-center gap-2 min-w-0">
                          <ClientAvatar
                            firstname={client.firstname}
                            lastname={client.lastname}
                            userId={client.user_id}
                          />
                          <span className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {client.firstname} {client.lastname}
                          </span>
                        </div>

                        {/* Volume */}
                        <span className="text-sm tabular-nums">
                          {client.total_volume ?? 0}
                        </span>

                        {/* Earned */}
                        <span className="text-sm tabular-nums text-emerald-500 font-medium">
                          {client.ib_commission_earned ?? 0}
                        </span>

                        {/* Parent */}
                        <span className="text-xs text-muted-foreground font-mono">
                          #{client.parent_user_id ?? "—"}
                        </span>

                        {/* Is IB */}
                        <div>
                          {client.is_ib ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                              <FaCheck className="w-2.5 h-2.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <FaXmark className="w-2.5 h-2.5" /> No
                            </span>
                          )}
                        </div>

                        {/* Joined */}
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatIST(client.joined_at as string, {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Mobile cards ───────────────────────────────────────── */}
                <div className="flex flex-col gap-2 p-3 md:hidden">
                  {clients.map((client) => (
                    <button
                      key={client.user_id}
                      onClick={() => openDetail(client)}
                      className="flex items-center gap-3 w-full rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors px-3 py-3 text-left"
                    >
                      <ClientAvatar
                        firstname={client.firstname}
                        lastname={client.lastname}
                        userId={client.user_id}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {client.firstname} {client.lastname}
                          </span>
                          <Badge
                            variant={client.is_ib ? "success" : "secondary"}
                            className="text-[10px] shrink-0"
                          >
                            {client.is_ib ? "IB" : "Client"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            #{client.user_id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Vol: <span className="text-foreground">{client.total_volume ?? 0}</span>
                          </span>
                          <span className="text-xs text-emerald-500 font-medium">
                            +{client.ib_commission_earned ?? 0}
                          </span>
                        </div>
                      </div>
                      <LuArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>

                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </CardContent>

          {/* ── Pagination ── */}
          {!isLoading && !isError && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 shrink-0">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage(page - 1)}
                  className="h-7 w-7 p-0"
                >
                  <LuChevronLeft className="w-4 h-4" />
                </Button>
                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === page ? "default" : "ghost"}
                      disabled={isFetching}
                      onClick={() => setPage(p)}
                      className="h-7 w-7 p-0 text-xs"
                    >
                      {p}
                    </Button>
                  );
                })}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage(page + 1)}
                  className="h-7 w-7 p-0"
                >
                  <LuChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default RefredFrinds;
