"use client";
import { Icon } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { useState } from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

/** 42px navy circle with initials and a 1px gold ring, as in the reference header. */
export function UserAvatar({ name, className }: { name?: string; className?: string }) {
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <div
      className={cn(
        "flex size-[42px] items-center justify-center rounded-full bg-field border border-primary text-[15px] leading-6 text-foreground select-none",
        className
      )}
    >
      {initials || "U"}
    </div>
  );
}

const itemClass =
  "flex items-center gap-3 h-12 px-4 text-[15px] leading-6 text-foreground cursor-pointer rounded-none focus:bg-field focus:text-foreground";

export function UserNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const handleLogout = () => {
    setOpen(false);
    toast.promise(signOut(), {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out",
    });
  };

  const level = user?.kyc_status === "approved" ? 1 : 0;

  const items = [
    { icon: "user-16", label: "Profile Info", onClick: () => router.push("/root/profile") },
    {
      icon: "verification-16",
      label: "Verification",
      hint: `Level: ${level}/1`,
      onClick: () => router.push("/root/verification"),
    },
    { icon: "lock-16", label: "Security", onClick: () => router.push("/root/profile") },
  ];

  const Menu = () => (
    <>
      <div className="px-4 py-3 text-[13px] leading-4 text-muted-foreground truncate border-b border-border">
        {session.user?.email}
      </div>
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          onClick={() => {
            it.onClick();
            setOpen(false);
          }}
          className={cn(itemClass, "w-full text-left hover:bg-field")}
        >
          <Icon name={it.icon} size={16} className="text-muted-foreground" />
          <span className="flex flex-col leading-tight">
            {it.label}
            {it.hint && <span className="text-[12px] leading-4 text-muted-foreground">{it.hint}</span>}
          </span>
        </button>
      ))}
      <div className="border-t border-border" />
      <button type="button" onClick={handleLogout} className={cn(itemClass, "w-full text-left hover:bg-field")}>
        <Icon name="log-out-16" size={16} className="text-muted-foreground" />
        Logout
      </button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={open} onOpenChange={setOpen} direction="bottom">
        <Drawer.Trigger asChild>
          <button type="button" className="rounded-full" aria-label="Account menu">
            <UserAvatar name={session.user?.name ?? ""} className="size-9 text-[13px]" />
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 outline-none">
            <div className="bg-background rounded-t-lg border border-border overflow-hidden pb-6">
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <Menu />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-full" aria-label="Account menu">
          <UserAvatar name={session.user?.name ?? ""} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[288px] p-0 bg-background border border-border rounded-[4px] shadow-none"
      >
        <Menu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
