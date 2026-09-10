"use client";
import { Icon } from "@/components/ui/icon";

import { item_variants } from "@/constants/framer-motion";
import { motion } from "framer-motion";
import { TagChip } from "@/components/ui/tag-chip";
import { cn } from "@/lib/utils";

export interface WalletItem {
  id: number;
  name: string;
  icon: string;
  color: string;
  currency: string;
  type: string;
}

interface WalletCardProps {
  wallet: WalletItem;
  balance?: number;
  onHold?: number;
  baseValue?: number;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onClick?: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(n || 0);

/**
 * Reference wallet card: card-navy, 4px radius, 16px padding. Icon + name + tiny chips,
 * balance 18px with grey currency, then "Base Value" / "On Hold" pair.
 */
export const WalletCard = ({
  wallet,
  balance = 0,
  onHold = 0,
  baseValue,
  favorite = false,
  onToggleFavorite,
  onClick,
}: WalletCardProps) => {
  const base = baseValue ?? (wallet.currency === "USD" ? balance : 0);

  return (
    <motion.div
      variants={item_variants}
      onClick={onClick}
      className="relative rounded-[4px] bg-card p-4 cursor-pointer flex flex-col gap-4 hover:bg-card/80 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <img src={wallet.icon} alt={wallet.name} className="size-8 rounded-full object-contain" />
          <div className="flex flex-col">
            <span className="text-[15px] leading-5 text-foreground">{wallet.name}</span>
            <span className="flex items-center gap-1">
              <TagChip>{wallet.type === "fiat" ? "Fiat" : "Crypto"}</TagChip>
              <TagChip>#{wallet.id}</TagChip>
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className={cn(
            "size-8 inline-flex items-center justify-center rounded-[4px] transition-colors",
            favorite ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {favorite ? <Icon name="favorite-filled-16" size={16} /> : <Icon name="favorite-outline-16" size={16} />}
        </button>
      </div>

      <div className="text-[18px] leading-6 font-medium text-foreground">
        {fmt(balance)} <span className="text-muted-foreground">{wallet.currency}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[12px] leading-4 text-muted-foreground">Base Value</span>
          <span className="text-[12px] leading-4 text-foreground">{fmt(base)} USD</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] leading-4 text-muted-foreground">On Hold</span>
          <span className="text-[12px] leading-4 text-foreground">
            {fmt(onHold)} {wallet.currency}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
