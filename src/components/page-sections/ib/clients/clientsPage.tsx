"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Modal } from "@/components/ui/modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { cn, copyToClipboard, formatIST } from "@/lib/utils";
import { TMyClientsApiResponse } from "@/types/api.response";
import { useGetMyClients } from "@/hooks/useIB";
import React, { useCallback, useState } from "react";
import {
  LuHash, LuUser, LuGitBranch, LuLink, LuCalendarDays,
  LuTrendingUp, LuWallet, LuChevronLeft, LuChevronRight,
  LuRefreshCw, LuSearch, LuArrowRight,
} from "react-icons/lu";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { MdOutlineContentCopy } from "react-icons/md";
import { Spinner } from "@heroui/react";

/* ─── avatar helpers (shared) ────────────────────────────────────────────── */

const AVATAR_COLORS = [
  "bg-primary", "bg-rose-500", "bg-emerald-500", "bg-blue-500",
  "bg-amber-500", "bg-violet-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500",
];

function useAvatarColor() {
  return useCallback((id: string | number) => {
    let hash = 0;
    const s = String(id);
    for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }, []);
}

function ClientAvatar({ firstname, lastname, userId, size = "sm" }: {
  firstname: string; lastname: string; userId: string; size?: "sm" | "md" | "lg";
}) {
  const getColor = useAvatarColor();
  const sizeMap = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-12 h-12" };
  const textMap = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" };
  return (
    <Avatar className={sizeMap[size]}>
      <AvatarFallback className={cn(getColor(userId), "text-white font-semibold", textMap[size])}>
        {firstname.charAt(0).toUpperCase()}{lastname.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

/* ─── Client detail modal ─────────────────────────────────────────────────── */

function ClientDetailModal({
  client, isOpen, onClose,
}: {
  client: TMyClientsApiResponse["clients"][0] | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showAccounts, setShowAccounts] = useState(false);
  if (!client) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { onClose(); setShowAccounts(false); }}
      title="Client Details"
      description={`Referral info for ${client.firstname} ${client.lastname}`}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
          <ClientAvatar firstname={client.firstname} lastname={client.lastname} userId={client.user_id} size="lg" />
          <div>
            <p className="font-semibold text-foreground">{client.firstname} {client.lastname}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-muted-foreground">ID #{client.user_id}</span>
              <Button size="icon-sm" variant="ghost" className="h-4 w-4 p-0"
                onClick={() => copyToClipboard(client.user_id ?? "")}>
                <MdOutlineContentCopy className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{client.email}</p>
          </div>
          <Badge variant={client.is_ib ? "success" : "secondary"} className="ml-auto shrink-0">
            {client.is_ib ? "IB" : "Client"}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Volume",     value: client.total_volume,          icon: <LuTrendingUp className="w-3.5 h-3.5" /> },
            { label: "Commission", value: client.ib_commission_earned,  icon: <LuWallet className="w-3.5 h-3.5" /> },
            { label: "Level",      value: client.level ?? "—",          icon: <LuGitBranch className="w-3.5 h-3.5" /> },
            { label: "Children",   value: client.direct_children_count ?? 0, icon: <LuUser className="w-3.5 h-3.5" /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl bg-muted/30 p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon} {label}</div>
              <p className="font-bold text-foreground text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 text-sm">
          {[
            { icon: <LuLink className="w-3.5 h-3.5" />,         label: "Parent ID", value: `#${client.parent_user_id ?? "—"}` },
            { icon: <LuCalendarDays className="w-3.5 h-3.5" />, label: "Joined",    value: formatIST(client.joined_at as string, { day: "2-digit", month: "short", year: "numeric" }) },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
              <span className="text-muted-foreground flex items-center gap-1.5">{icon} {label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <LuWallet className="w-3.5 h-3.5" /> MT5 Accounts
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{client.mt5_accounts?.length ?? 0}</span>
              {(client.mt5_accounts?.length ?? 0) > 0 && (
                <Button size="sm" variant="outline" className="h-6 text-xs px-2"
                  onClick={() => setShowAccounts(!showAccounts)}>
                  {showAccounts ? "Hide" : "View"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {showAccounts && (
          <div className="rounded-xl border border-border/50 p-3 flex flex-col gap-2">
            {client.mt5_accounts.map((acc) => (
              <div key={acc.login} className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Login <span className="text-foreground font-medium">{acc.login}</span></span>
                <span className="text-primary font-semibold">{acc.balance}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ─── Pagination bar ──────────────────────────────────────────────────────── */

function Pagination({
  page, totalPages, isFetching, setPage,
}: {
  page: number; totalPages: number; isFetching: boolean; setPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  return (
    <div className="flex items-center justify-between py-3 border-t border-border/30">
      <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" disabled={page <= 1 || isFetching}
          onClick={() => setPage(page - 1)} className="h-7 w-7 p-0">
          <LuChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = start + i;
          return (
            <Button key={p} size="sm" variant={p === page ? "default" : "ghost"}
              disabled={isFetching} onClick={() => setPage(p)} className="h-7 w-7 p-0 text-xs">
              {p}
            </Button>
          );
        })}
        <Button size="sm" variant="ghost" disabled={page >= totalPages || isFetching}
          onClick={() => setPage(page + 1)} className="h-7 w-7 p-0">
          <LuChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/* ─── Main page component ─────────────────────────────────────────────────── */

const ClientsPage = () => {
  const {
    data, isLoading, isFetching, isError, refetch,
    page, setPage, search, setSearch, totalPages, totalCount,
  } = useGetMyClients();

  const [selected, setSelected] = useState<TMyClientsApiResponse["clients"][0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const clients = data?.clients ?? [];

  const openDetail = (client: TMyClientsApiResponse["clients"][0]) => {
    setSelected(client);
    setDetailOpen(true);
  };

  return (
    <>
      <ClientDetailModal client={selected} isOpen={detailOpen} onClose={() => setDetailOpen(false)} />

      <motion.div initial="hidden" animate="visible" variants={container_variants} className="flex flex-col gap-4">
        {/* ── Toolbar ── */}
        <motion.div variants={item_variants} className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email or ID…"
              className="w-full pl-9 pr-3 h-9 rounded-xl bg-card border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {totalCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {totalCount} clients
              </Badge>
            )}
            <Button size="sm" variant="ghost" onClick={() => refetch()}
              className="h-9 w-9 p-0" title="Refresh">
              <LuRefreshCw className={cn("w-3.5 h-3.5", isFetching && "animate-spin")} />
            </Button>
          </div>
        </motion.div>

        {/* ── Loading ── */}
        {isLoading && (
          <motion.div variants={item_variants} className="flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-muted/40" />
            ))}
          </motion.div>
        )}

        {/* ── Error ── */}
        {!isLoading && isError && (
          <motion.div variants={item_variants}
            className="flex flex-col items-center justify-center gap-3 py-20">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <LuRefreshCw className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm text-muted-foreground">Failed to load clients</p>
            <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-1.5">
              <LuRefreshCw className="w-3.5 h-3.5" /> Try again
            </Button>
          </motion.div>
        )}

        {/* ── Empty ── */}
        {!isLoading && !isError && clients.length === 0 && (
          <motion.div variants={item_variants}
            className="flex flex-col items-center justify-center gap-3 py-20">
            <img src="/svgs/nothing.svg" alt="no clients"
              className="h-40 grayscale opacity-40 object-contain" />
            <p className="text-sm text-muted-foreground">
              {search ? "No clients match your search" : "No referred clients yet"}
            </p>
          </motion.div>
        )}

        {/* ── Table ── */}
        {!isLoading && !isError && clients.length > 0 && (
          <motion.div variants={item_variants} className="bg-card rounded-2xl border border-border/40 overflow-hidden">
            {/* ─── Desktop table ──────────────────────────────────────── */}
            <ScrollArea className="hidden md:block">
              <div className="min-w-[700px]">
                {/* Header */}
                <div className="grid grid-cols-[60px_1fr_100px_110px_80px_80px_110px] gap-x-3 px-5 py-3 border-b border-border/30 bg-muted/20">
                  {[
                    { label: "ID",       icon: <LuHash className="w-3 h-3" /> },
                    { label: "Name",     icon: <LuUser className="w-3 h-3" /> },
                    { label: "Volume",   icon: <LuTrendingUp className="w-3 h-3" /> },
                    { label: "Earned",   icon: <LuWallet className="w-3 h-3" /> },
                    { label: "Level",    icon: <LuGitBranch className="w-3 h-3" /> },
                    { label: "Is IB",    icon: null },
                    { label: "Joined",   icon: <LuCalendarDays className="w-3 h-3" /> },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {icon} {label}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {clients.map((client) => (
                  <button key={client.user_id} onClick={() => openDetail(client)}
                    className="grid grid-cols-[60px_1fr_100px_110px_80px_80px_110px] gap-x-3 px-5 py-3.5 items-center w-full text-left border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors group">
                    <span className="text-xs text-muted-foreground font-mono">#{client.user_id}</span>
                    <div className="flex items-center gap-2 min-w-0">
                      <ClientAvatar firstname={client.firstname} lastname={client.lastname} userId={client.user_id} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {client.firstname} {client.lastname}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                      </div>
                    </div>
                    <span className="text-sm tabular-nums">{client.total_volume ?? 0}</span>
                    <span className="text-sm tabular-nums text-emerald-500 font-medium">{client.ib_commission_earned ?? 0}</span>
                    <span className="text-sm text-muted-foreground">{client.level ?? "—"}</span>
                    <div>
                      {client.is_ib
                        ? <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium"><FaCheck className="w-2.5 h-2.5" /> Yes</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><FaXmark className="w-2.5 h-2.5" /> No</span>
                      }
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatIST(client.joined_at as string, { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* ─── Mobile cards ──────────────────────────────────────── */}
            <div className="flex flex-col divide-y divide-border/20 md:hidden">
              {clients.map((client) => (
                <button key={client.user_id} onClick={() => openDetail(client)}
                  className="flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors">
                  <ClientAvatar firstname={client.firstname} lastname={client.lastname} userId={client.user_id} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {client.firstname} {client.lastname}
                      </span>
                      <Badge variant={client.is_ib ? "success" : "secondary"} className="text-[10px] shrink-0">
                        {client.is_ib ? "IB" : "Client"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">#{client.user_id}</span>
                      <span className="text-xs text-muted-foreground">Vol: <span className="text-foreground">{client.total_volume ?? 0}</span></span>
                      <span className="text-xs text-emerald-500 font-medium">+{client.ib_commission_earned ?? 0}</span>
                    </div>
                  </div>
                  <LuArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-5">
              <Pagination page={page} totalPages={totalPages} isFetching={isFetching} setPage={setPage} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default ClientsPage;
