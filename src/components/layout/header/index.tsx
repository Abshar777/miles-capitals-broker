"use client";
import { Icon } from "@/components/ui/icon";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import DrawerReuse from "@/components/ui/drawerReuse";
import NotificationContainer from "@/components/page-sections/notifications/notificationContainer";
import { useGetUnreadCount } from "@/hooks/useNotification";
import { useThemeTransition } from "@/components/theme/theme-toggler-button";
import { useTheme } from "next-themes";
import { getPageTitle } from "@/constants/pageTitles";
import { useRouter } from "nextjs-toploader/app";

const iconBtn =
  "size-8 flex items-center justify-center rounded-[4px] text-muted-foreground hover:text-foreground transition-colors relative";
const iconBtnDesktop = iconBtn + " hidden sm:flex";

/** 80px reference header: page title left, theme / language / bell / notes / avatar right. */
export default function Header() {
  const [notification, setNotification] = useState(false);
  const { count: unreadCount } = useGetUnreadCount();
  const { setTheme, theme } = useTheme();
  const { startTransition } = useThemeTransition();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && theme) {
      localStorage.setItem("theme", theme as string);
    }
  }, [theme]);

  const firstName = session?.user?.name?.split(" ")[0] || "";
  const title = pathname.startsWith("/root/dashboard")
    ? `Welcome${firstName ? `, ${firstName}` : ""}`
    : getPageTitle(pathname);

  return (
    <>
      <DrawerReuse
        isOpen={notification}
        setIsOpen={setNotification}
        title="Notifications"
        description={`You have ${unreadCount} unread notifications`}
      >
        <></>
        <NotificationContainer />
      </DrawerReuse>

      <header className="flex h-20 shrink-0 items-center justify-between gap-4 bg-background px-4 md:px-10">
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="md:hidden -ml-1 text-muted-foreground" />
          <h1 className="text-[24px] leading-7 font-medium text-foreground truncate">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className={iconBtn}
            onClick={() =>
              startTransition(() => {
                setTheme(theme === "light" ? "dark" : "light");
              })
            }
          >
            {theme === "light" ? <Icon name="moon-16" size={16} /> : <Icon name="sun-16" size={16} />}
          </button>

          <div className="hidden sm:flex items-center gap-1 h-6 text-muted-foreground select-none">
            <Flag code="GB" className="w-4 h-4 rounded-full object-cover" />
            <span className="text-[15px] leading-6">EN</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className={iconBtn}
            onClick={() => setNotification(!notification)}
          >
            <Icon name="notification-16" size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0 left-[18px] inline-flex h-[14px] items-center rounded-[30px] bg-destructive px-1 text-[10px] leading-[10px] text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label="Helpdesk"
            className={iconBtnDesktop}
            onClick={() => router.push("/root/support")}
          >
            <Icon name="document-16" size={16} />
          </button>

          <div className="ml-2" data-tour="user-card">
            <UserNav />
          </div>
        </div>
      </header>
    </>
  );
}
