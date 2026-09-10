"use client";
import { Icon } from "@/components/ui/icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/navItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import * as React from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUnreadSupportCount } from "@/hooks/useSupport";

// Maps nav item title → data-tour id for the walkthrough
const TOUR_ID: Record<string, string> = {
  Dashboard: "nav-dashboard",
  Wallets: "nav-wallets",
  MT5: "nav-mt5",
  Funds: "nav-funds",
  "Transaction History": "nav-transactions",
  "IB Room": "nav-ib",
  Helpdesk: "nav-support",
};

// Reference sprite icon per menu title
const NAV_ICON: Record<string, string> = {
  Dashboard: "dashboard-16",
  Wallets: "wallet-16",
  MT5: "mt5-16",
  Funds: "finance-16",
  "Transaction History": "history-backward-16",
  Helpdesk: "support-16",
  "IB Room": "partnership-16",
};

const SUB_TOUR_ID: Record<string, string> = {
  Deposit: "nav-deposit",
  Withdraw: "nav-withdraw",
  Transfer: "nav-wallet-mt5",
  "MT5 to Wallet": "nav-mt5-wallet",
  "Internal Transfer": "nav-internal",
};

/* Reference menu row: 48px tall, 12px 24px 12px 32px padding, 16px icon, 15px label.
   Active = white text + 3px gold bar on the left edge. Inactive = grey. */
const rowClass =
  "relative flex h-12 w-full items-center gap-4 rounded-none rounded-r-[4px] pl-8 pr-6 py-3 text-[15px] leading-6 text-muted-foreground hover:text-foreground hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:font-normal data-[active=true]:text-foreground [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:size-12 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0! group-data-[collapsible=icon]:p-0! [&>span]:group-data-[collapsible=icon]:hidden [&>span]:truncate";

const ActiveBar = ({ show }: { show: boolean }) =>
  show ? <i aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-[2px] not-italic" /> : null;

const NewBadge = () => (
  <span className="ml-auto inline-flex h-4 items-center rounded-[4px] bg-destructive px-1.5 text-[10px] leading-4 text-white group-data-[collapsible=icon]:hidden">
    New
  </span>
);

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { state, isMobile, setOpenMobile, toggleSidebar } = useSidebar();
  const { unreadCount: supportUnreadCount } = useUnreadSupportCount();

  useEffect(() => {
    setOpenMobile(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const collapsed = state === "collapsed" && !isMobile;
  const logo = theme === "light" ? "/miles/logo-light.svg" : "/miles/logo-dark.svg";

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r-0 [&_[data-slot=sidebar-container]]:border-r-0">
      <SidebarHeader className="p-0 h-20 shrink-0">
        <Link href="/root/dashboard" className="flex items-center h-20 pl-4" aria-label="Miles Capital">
          {collapsed ? (
            <img src="/miles/logo-short.svg" alt="Miles Capital" className="h-12 w-auto -ml-1" />
          ) : (
            <img src={logo} alt="Miles Capital" width={240} height={64} className="h-16 w-auto max-w-[240px]" />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <ScrollArea className="h-full">
          <SidebarMenu className="gap-0">
            {navItems.map((item) => {
              const iconName = NAV_ICON[item.title] || "dashboard-16";
              const groupActive = pathname?.startsWith(item.url);

              if (item.items && item.items.length > 0) {
                if (collapsed) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={groupActive}
                            data-tour={TOUR_ID[item.title]}
                            className={rowClass}
                          >
                            <ActiveBar show={!!groupActive} />
                            <Icon name={iconName} size={16} />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="min-w-44 bg-background border-border rounded-[4px]">
                          <DropdownMenuLabel className="text-muted-foreground">{item.title}</DropdownMenuLabel>
                          {item.items.map((sub) => (
                            <DropdownMenuItem key={sub.title} asChild className="rounded-[4px] focus:bg-field">
                              <Link href={sub.url} data-tour={SUB_TOUR_ID[sub.title]}>
                                {sub.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible key={item.title} asChild defaultOpen={!!groupActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={false}
                          data-tour={TOUR_ID[item.title]}
                          className={cn(rowClass, groupActive && "text-foreground")}
                        >
                          <Icon name={iconName} size={16} />
                          <span>{item.title}</span>
                          <Icon name="dropdown-16" size={16} className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ul className="flex flex-col">
                          {item.items.map((sub) => {
                            const active = pathname === sub.url;
                            return (
                              <li key={sub.title} className="relative">
                                <Link
                                  href={sub.url}
                                  data-tour={SUB_TOUR_ID[sub.title]}
                                  className={cn(
                                    "relative flex h-12 items-center pl-16 pr-6 py-3 text-[15px] leading-6 rounded-r-[4px] transition-colors",
                                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                  )}
                                >
                                  <ActiveBar show={active} />
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              const active = pathname === item.url || pathname?.startsWith(item.url + "/");
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={!!active}
                    data-tour={TOUR_ID[item.title]}
                    className={rowClass}
                  >
                    <Link href={item.url}>
                      <ActiveBar show={!!active} />
                      <Icon name={iconName} size={16} />
                      <span>{item.title}</span>
                      {item.badge && !(item.title === "Helpdesk" && supportUnreadCount > 0) && <NewBadge />}
                      {item.title === "Helpdesk" && supportUnreadCount > 0 && (
                        <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-[4px] bg-destructive px-1 text-[10px] leading-4 text-white group-data-[collapsible=icon]:hidden">
                          {supportUnreadCount > 99 ? "99+" : supportUnreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-0 pb-2">
        <div className="mx-6 border-t border-border group-data-[collapsible=icon]:mx-2" />
        <SidebarMenu className="gap-0 pt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Leave feedback"
              className={rowClass}
              data-tour="nav-feedback"
              onClick={() => router.push("/root/feedback")}
            >
              <Icon name="megaphone-16" size={16} />
              <span>Leave feedback</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!isMobile && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={collapsed ? "Expand" : "Collapse"}
                className={rowClass}
                onClick={toggleSidebar}
              >
                {collapsed ? <Icon name="expand-16" size={16} /> : <Icon name="collapse-16" size={16} />}
                <span>{collapsed ? "Expand" : "Collapse"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
