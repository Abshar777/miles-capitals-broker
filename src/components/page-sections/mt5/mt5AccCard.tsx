"use client";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { item_variants } from "@/constants/framer-motion";
import { mt5Currencies } from "@/constants/mt5.const";
import { useGetMt5AccDetails, useResetMt5Password } from "@/hooks/useMt5";
import { TMT5AccountListApiResponse } from "@/types/api.response";
import { toast } from "sonner";
import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LevrageForm from "@/components/forms/lavrageForm";
import { TagChip } from "@/components/ui/tag-chip";

const isCentAccount = (category: string) => category === "cent";
const fmtBalance = (val: number, isCent: boolean) => (isCent ? val / 100 : val);
const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n || 0);

const copy = (value: string | number, label: string) => {
  navigator.clipboard.writeText(String(value));
  toast.success(`${label} copied to clipboard`);
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 h-12 border-b border-border last:border-0">
    <span className="text-[15px] leading-6 text-muted-foreground">{label}</span>
    <span className="flex items-center gap-2 text-[15px] leading-6 text-foreground">{children}</span>
  </div>
);

const IconBtn = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="size-8 inline-flex items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-field transition-colors"
  >
    {children}
  </button>
);

/**
 * Reference MT5 account card: icon + login + chips (Live/Demo, leverage, #login),
 * 18px balance, Equity line, full-width navy "Deposit". Settings icon opens the details modal.
 */
const Mt5AccCard = ({ account }: { account: TMT5AccountListApiResponse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"master" | "investor">("master");
  const isCent = isCentAccount(account.account_category);
  const live = account.account_type?.toUpperCase() === "LIVE";
  const { setType, loading, setLogin, accountDetails, credentialsId } = useGetMt5AccDetails();
  const { isPending, onSubmit } = useResetMt5Password();
  const router = useRouter();

  const openDetails = () => {
    setType(account.account_type);
    setLogin(account.login.toString());
    setIsOpen(true);
  };

  const balance = fmtBalance(account?.balance || 0, isCent);

  return (
    <motion.div variants={item_variants}>
      <Modal
        title={`Account ${account.login}`}
        description="MetaTrader 5 account details"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col">
          {loading && (
            <div className="flex items-center w-full justify-center py-10">
              <Spinner color="primary" />
            </div>
          )}
          {!loading && accountDetails && (
            <>
              <Row label="Login">
                {accountDetails.login}
                <IconBtn label="Copy login" onClick={() => copy(accountDetails.login, "Login")}>
                  <Icon name="copy-16" size={16} />
                </IconBtn>
              </Row>
              <Row label="Balance">
                {fmt(fmtBalance(accountDetails.balance, accountDetails.account_category === "cent"))} USD
              </Row>
              <Row label="Equity">
                {fmt(fmtBalance(accountDetails?.equity || 0, accountDetails.account_category === "cent"))} USD
              </Row>
              <Row label="Leverage">
                1:{accountDetails.leverage}
                <Dialog>
                  <DialogTrigger asChild>
                    <span>
                      <IconBtn label="Edit leverage" onClick={() => {}}>
                        <Icon name="edit-16" size={16} />
                      </IconBtn>
                    </span>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-border rounded-[4px]">
                    <DialogHeader>
                      <DialogTitle className="text-[18px] font-medium">Update Leverage</DialogTitle>
                    </DialogHeader>
                    <LevrageForm
                      OLdlavrage={accountDetails.leverage.toString()}
                      login={accountDetails.login.toString()}
                      credID={credentialsId || ""}
                    />
                  </DialogContent>
                </Dialog>
              </Row>
              <Row label="Name">
                {accountDetails.first_name} {accountDetails.last_name}
              </Row>
              <Row label="Master password">
                <span className="font-mono">{accountDetails.master_password}</span>
                <IconBtn label="Copy master password" onClick={() => copy(accountDetails.master_password, "Master password")}>
                  <Icon name="copy-16" size={16} />
                </IconBtn>
                <IconBtn
                  label="Reset master password"
                  onClick={() => {
                    onSubmit({ mt5_login: accountDetails.login, password_type: "master" });
                    setPosition("master");
                  }}
                >
                  {isPending && position === "master" ? <Spinner size="sm" /> : <Icon name="reset-16" size={16} />}
                </IconBtn>
              </Row>
              <Row label="Investor password">
                <span className="font-mono">{accountDetails.investor_password}</span>
                <IconBtn label="Copy investor password" onClick={() => copy(accountDetails.investor_password, "Investor password")}>
                  <Icon name="copy-16" size={16} />
                </IconBtn>
                <IconBtn
                  label="Reset investor password"
                  onClick={() => {
                    onSubmit({ mt5_login: accountDetails.login, password_type: "investor" });
                    setPosition("investor");
                  }}
                >
                  {isPending && position === "investor" ? <Spinner size="sm" /> : <Icon name="reset-16" size={16} />}
                </IconBtn>
              </Row>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(`/root/funds/transfer?accountId=${account.login}`)}
                  className="h-10 rounded-[4px] bg-primary px-6 text-[13.33px] text-black outline outline-1 -outline-offset-1 outline-transparent hover:brightness-110 hover:outline-primary transition-[filter,outline-color] duration-150 ease-in-out"
                >
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(`https://metatraderweb.app/trade?login=${account.login}`, "_blank");
                      toast.success("Trading Platform Opened");
                    }
                  }}
                  className="h-10 inline-flex items-center justify-center gap-2 rounded-[4px] bg-field px-6 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
                >
                  Trade
                  <Icon name="external-link-16" size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      <div className="rounded-[4px] bg-card p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <img src={mt5Currencies[0].iconImage} alt="USD" className="size-8 rounded-full object-contain" />
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-[15px] leading-5 text-foreground">
                {account.login}
                <button
                  type="button"
                  aria-label="Copy login"
                  onClick={() => copy(account.login, "Login")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="copy-16" size={12} />
                </button>
              </span>
              <span className="flex items-center gap-1">
                {live ? <TagChip tone="positive">Live</TagChip> : <TagChip>Demo</TagChip>}
                <TagChip>{account.leverage}x</TagChip>
                <TagChip>#{account.login}</TagChip>
              </span>
            </div>
          </div>
          <IconBtn label="Account settings" onClick={openDetails}>
            <Icon name="settings-16" size={16} />
          </IconBtn>
        </div>

        <div className="flex flex-col">
          <span className="text-[18px] leading-6 font-medium text-foreground">
            {fmt(balance)} <span className="text-muted-foreground">USD</span>
          </span>
          <span className="text-[12px] leading-4 text-muted-foreground">
            Equity <span className="text-foreground">{fmt(balance)} USD</span>
          </span>
        </div>

        {live ? (
          <button
            type="button"
            onClick={() => router.push(`/root/funds/transfer?accountId=${account.login}`)}
            className="h-10 w-full rounded-[4px] bg-field px-6 text-[15px] text-foreground outline outline-1 -outline-offset-1 outline-transparent hover:outline-primary/40 transition-[outline-color] duration-150 ease-in-out"
          >
            Deposit
          </button>
        ) : (
          <div className="h-10 flex items-center text-[15px] text-muted-foreground capitalize">
            {account.account_category}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Mt5AccCard;
