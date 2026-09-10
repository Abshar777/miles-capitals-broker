"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";

interface WalletDetailPanelProps {
  open: boolean;
  onClose: () => void;
  wallet: {
    name: string;
    icon: string;
    color: string;
    currency: string;
    type: string;
  } | null;
  balance: number;
}

const actions = [
  {
    label: "Deposit",
    icon: "arrow-down-16",
    href: "/root/funds/deposit",
    color: "text-positive",
    description: "Add funds to your wallet",
  },
  {
    label: "Withdraw",
    icon: "arrow-up-16",
    href: "/root/funds/withdraw",
    color: "text-destructive",
    description: "Withdraw to external account",
  },
  {
    label: "Wallet → MT5",
    icon: "transfer-16",
    href: "/root/funds/transfer",
    color: "text-demo",
    description: "Fund your MT5 trading account",
  },
  {
    label: "MT5 → Wallet",
    icon: "transfer-16",
    href: "/root/funds/mt5-wallet",
    color: "text-primary",
    description: "Withdraw from MT5 to wallet",
  },
];

const PanelContent = ({
  wallet,
  balance,
  onAction,
}: {
  wallet: WalletDetailPanelProps["wallet"];
  balance: number;
  onAction: (href: string) => void;
}) => {
  if (!wallet) return null;

  const isUSD = wallet.currency === "USD";

  return (
    <div className="flex flex-col gap-5 p-4 pt-2">
      {/* Wallet identity */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
        >
          <img
            src={wallet.icon}
            alt={wallet.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div>
          <p className="text-[12px] leading-4 text-muted-foreground">Wallet</p>
          <h2 className="text-[18px] leading-6 font-medium text-foreground">
            {wallet.name}
          </h2>
        </div>
      </div>

      <Separator />

      {/* Balance */}
      <div className="bg-card rounded-[4px] p-4 flex flex-col gap-1">
        <p className="text-[15px] leading-6 text-muted-foreground">Available Balance</p>
        <p className="text-[32px] leading-10 font-medium text-foreground">
          {isUSD ? balance.toFixed(2) : "0.00"}
          <span className="text-base font-normal text-muted-foreground ml-2">
            {isUSD ? "USD" : wallet.currency}
          </span>
        </p>
        {!isUSD && (
          <p className="text-xs text-muted-foreground mt-1">
            Only USD wallet is active in this account.
          </p>
        )}
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <p className="text-[15px] leading-6 text-muted-foreground">Quick Actions</p>
        {actions.map((action) => {
          return (
            <button
              key={action.label}
              onClick={() => onAction(action.href)}
              className="flex items-center gap-3 w-full rounded-[4px] p-3 bg-card hover:bg-field transition-colors text-left group"
            >
              <div className="w-9 h-9 rounded-[4px] bg-field flex items-center justify-center shrink-0">
                <Icon name={action.icon} size={16} className={action.color} />
              </div>
              <div>
                <p className="text-[15px] leading-6 text-foreground">
                  {action.label}
                </p>
                <p className="text-[12px] leading-4 text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const WalletDetailPanel = ({
  open,
  onClose,
  wallet,
  balance,
}: WalletDetailPanelProps) => {
  const isMobile = useIsMobile();
  const router = useRouter();

  const handleAction = (href: string) => {
    onClose();
    router.push(href);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(v) => !v && onClose()} direction="bottom">
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>{wallet?.name} Wallet</DrawerTitle>
            <DrawerDescription>Manage your {wallet?.name} wallet</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <PanelContent wallet={wallet} balance={balance} onAction={handleAction} />
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] overflow-y-auto p-0 bg-background border-l border-border">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle>{wallet?.name} Wallet</SheetTitle>
          <SheetDescription>Manage your {wallet?.name} wallet</SheetDescription>
        </SheetHeader>
        <PanelContent wallet={wallet} balance={balance} onAction={handleAction} />
      </SheetContent>
    </Sheet>
  );
};
