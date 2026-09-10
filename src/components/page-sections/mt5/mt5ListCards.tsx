"use client";
import { Icon } from "@/components/ui/icon";
import { container_variants } from "@/constants/framer-motion";
import { useMt5UiStore } from "@/store/mt5uiStore";
import { TMT5AccountListApiResponse } from "@/types/api.response";
import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import Mt5AccCard from "./mt5AccCard";
import { PillTabs } from "@/components/ui/pill-tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Filter = "all" | "LIVE" | "DEMO";
type Sort = "default" | "balance" | "login";

/** Reference MT5 list: "+ Add Account" / "Last Updated" row, pills + search + sort, 2-col cards. */
const Mt5ListCards = ({
  accounts,
  setAccountType,
}: {
  accounts: TMT5AccountListApiResponse[];
  setAccountType: any;
}) => {
  const { setOpenModal } = useMt5UiStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("default");
  const [updatedAt] = useState(() => new Date());

  const filteredAccounts = useMemo(() => {
    let list = accounts.filter((a) => a.login.toString().toLowerCase().includes(search.toLowerCase()));
    if (filter !== "all") list = list.filter((a) => a.account_type?.toUpperCase() === filter);
    if (sort === "balance") list = [...list].sort((a, b) => (b.balance || 0) - (a.balance || 0));
    if (sort === "login") list = [...list].sort((a, b) => a.login - b.login);
    return list;
  }, [accounts, search, filter, sort]);

  const time = `${updatedAt.getHours().toString().padStart(2, "0")}:${updatedAt
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-end gap-6 text-[15px] leading-6">
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-1 text-primary hover:text-primary-hover"
        >
          <Icon name="plus-16" size={16} />
          Add Account
        </button>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Icon name="clock-16" size={16} />
          Last Updated: {time}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PillTabs<Filter>
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setAccountType(v === "all" ? undefined : v);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "LIVE", label: "Live" },
            { value: "DEMO", label: "Demo" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative w-full sm:w-[248px]">
            <Icon name="search-16" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-[4px] border border-field bg-field pl-10 pr-4 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-primary/60"
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="h-12 data-[size=default]:h-12 w-full sm:w-[190px] px-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="balance">Balance</SelectItem>
              <SelectItem value="login">Login</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        variants={container_variants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10"
      >
        {filteredAccounts.map((account) => (
          <Mt5AccCard key={account.login} account={account} />
        ))}
        {filteredAccounts.length === 0 && (
          <div className="col-span-full h-[240px] rounded-[4px] border border-border flex items-center justify-center text-[18px] leading-6 font-medium text-foreground">
            No items to show
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Mt5ListCards;
