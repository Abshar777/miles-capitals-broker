"use client";
import type React from "react";
import { Drawer } from "vaul";
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Calendar, AlertTriangle, Mail, Loader2 } from "lucide-react";
// import { useMarkAllNotificationsAsRead } from "@/hooks/useNotification"
import { useState } from "react";

interface DrawerReuseProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
  title?: string;
  description?: string;
}

const DrawerReuse = ({
  isOpen,
  setIsOpen,
  children,
  side = "right",
  className,
  title,
  description,
}: DrawerReuseProps) => {
  const closeDrawer = () => setIsOpen(false);

  return (
    <Drawer.Root
      shouldScaleBackground
      open={isOpen}
      onOpenChange={setIsOpen}
      direction={side}
    
    >
      <Drawer.Portal >
        <Drawer.Overlay className="fixed z-50 inset-0 bg-zinc-500/5 backdrop-blur-sm" />
        <Drawer.Content
          className={cn(
            "right-1 top-2 bottom-2 rounded-lg flex flex-col gap-2 overflow-hidden bg-card p-2   h-full fixed z-50 outline-none w-[350px]",
            side === "left" && "left-1",
            className
          )}
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="flex flex-col border-b border-foreground/40 pb-2 border-dashed">
            <Drawer.Title className="text-lg font-medium">{title}</Drawer.Title>
            <Drawer.Description className="text-sm text-zinc-500">
              {description}
            </Drawer.Description>
          </div>
          <div className="mt-2">
            {children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default DrawerReuse;
