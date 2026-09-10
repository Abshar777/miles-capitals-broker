"use client";
import { Icon } from "@/components/ui/icon";
import PageContainer from "@/components/providers/page-container";
import { container_variants, item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { WalletCard, WalletItem } from "@/components/page-sections/wallets/walletCard";
import { WalletDetailPanel } from "@/components/page-sections/wallets/walletDetailPanel";
import { useWalletBalance } from "@/hooks/useWallet";
import { PillTabs } from "@/components/ui/pill-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const WALLETS: WalletItem[] = [
  { id: 1, name: "USD",          icon: "/svgs/currency/usd.svg", color: "bg-green-600",   currency: "USD", type: "fiat"   },
  { id: 2, name: "EUR",          icon: "/svgs/currency/eur.svg", color: "bg-blue-500",    currency: "EUR", type: "fiat"   },
  { id: 3, name: "Bitcoin",      icon: "/svgs/currency/btc.svg", color: "bg-orange-500",  currency: "BTC", type: "crypto" },
  { id: 4, name: "Ethereum",     icon: "/svgs/currency/eth.svg", color: "bg-indigo-500",  currency: "ETH", type: "crypto" },
  { id: 5, name: "Litecoin",     icon: "/svgs/currency/ltc.svg", color: "bg-slate-400",   currency: "LTC", type: "crypto" },
  { id: 6, name: "Bitcoin Cash", icon: "/svgs/currency/bch.svg", color: "bg-lime-600",    currency: "BCH", type: "crypto" },
];

type Filter = "all" | "favorites" | "fiat" | "crypto";
type Sort = "default" | "name" | "balance";

const FAV_KEY = "wallet-favorites";
const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

/** Reference Wallets page: estimated total, search/sort/layout toolbar, pills, 2-col cards. */
const page = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("default");
  const [hideZero, setHideZero] = useState(false);
  const [hideTotal, setHideTotal] = useState(false);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selected, setSelected] = useState<WalletItem | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { data: balance } = useWalletBalance();
  const usdBalance = Number((balance as any)?.available_balance ?? balance?.current_balance ?? 0);
  const onHold = Number((balance as any)?.hold_balance ?? 0);
  const currency = balance?.currency || "USD";

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      if (Array.isArray(saved)) setFavorites(saved);
    } catch {}
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const balanceOf = (w: WalletItem) => (w.currency === "USD" ? usdBalance : 0);

  const wallets = useMemo(() => {
    let list = [...WALLETS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(q) || w.currency.toLowerCase().includes(q));
    }
    if (filter === "favorites") list = list.filter((w) => favorites.includes(w.id));
    if (filter === "fiat" || filter === "crypto") list = list.filter((w) => w.type === filter);
    if (hideZero) list = list.filter((w) => balanceOf(w) > 0);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "balance") list.sort((a, b) => balanceOf(b) - balanceOf(a));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter, sort, hideZero, favorites, usdBalance]);

  return (
    <PageContainer scrollable={true}>
      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="flex flex-1 flex-col gap-6 w-full"
      >
        <motion.div variants={item_variants} className="flex flex-col">
          <div className="flex items-center gap-2 text-[15px] leading-6 text-muted-foreground">
            Estimated Total
            <button
              type="button"
              aria-label={hideTotal ? "Show total" : "Hide total"}
              onClick={() => setHideTotal((v) => !v)}
              className="size-5 inline-flex items-center justify-center hover:text-foreground"
            >
              {hideTotal ? <Icon name="hide-16" size={16} /> : <Icon name="show-16" size={16} />}
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[32px] leading-10 font-medium text-foreground">
              {hideTotal ? "••••" : fmt(usdBalance)}
            </span>
            <span className="text-[24px] leading-8 text-muted-foreground">{currency}</span>
          </div>
        </motion.div>

        <motion.div variants={item_variants} className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          <div className="relative w-full sm:w-[184px]">
            <Icon name="search-16" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-[4px] border border-field bg-field pl-10 pr-4 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary/60"
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-12 data-[size=default]:h-12 w-full sm:w-[212px] px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            aria-label="Toggle layout"
            onClick={() => setLayout((l) => (l === "grid" ? "list" : "grid"))}
            className="size-12 hidden sm:inline-flex items-center justify-center rounded-[4px] text-muted-foreground/40 hover:text-foreground"
          >
            {layout === "grid" ? <Icon name="list-16" size={16} /> : <Icon name="grid-16" size={16} />}
          </button>
        </motion.div>

        <motion.div variants={item_variants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PillTabs<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "favorites", label: "Favorites" },
              { value: "fiat", label: "Fiat" },
              { value: "crypto", label: "Crypto" },
            ]}
          />
          <label className="flex items-center gap-2 text-[15px] leading-6 text-foreground cursor-pointer select-none">
            <Checkbox
              checked={hideZero}
              onCheckedChange={(v) => setHideZero(v === true)}
              className="size-6 rounded-[4px] border-muted-foreground bg-transparent dark:bg-transparent data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-black shadow-none"
            />
            Hide zero balances
          </label>
        </motion.div>

        <motion.div
          variants={container_variants}
          className={cn("grid gap-4", layout === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}
        >
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              balance={balanceOf(wallet)}
              onHold={wallet.currency === "USD" ? onHold : 0}
              favorite={favorites.includes(wallet.id)}
              onToggleFavorite={() => toggleFavorite(wallet.id)}
              onClick={() => {
                setSelected(wallet);
                setPanelOpen(true);
              }}
            />
          ))}
          {wallets.length === 0 && (
            <div className="col-span-full h-[240px] rounded-[4px] border border-border flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <span className="text-[18px] leading-6 font-medium text-foreground">No wallets found</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <WalletDetailPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        wallet={selected}
        balance={selected?.currency === "USD" ? usdBalance : 0}
      />
    </PageContainer>
  );
};

export default page;
