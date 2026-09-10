"use client";

import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { defaultPatterns } from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

/**
 * Reference underline tabs: 48px tall, 15px text, grey inactive, gold text + 2px gold
 * underline when active, hairline under the whole list.
 */
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    /** Kept for backwards compatibility; ignored. */
    indicatorClassName?: string;
  }
>(({ className, indicatorClassName: _indicator, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "relative flex w-full items-end gap-8 border-b border-border overflow-x-auto [scrollbar-width:none] text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { trigger } = useWebHaptics();
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex h-12 shrink-0 cursor-pointer items-center whitespace-nowrap px-0 text-[15px] leading-6 text-muted-foreground transition-colors -mb-px",
        "hover:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-foreground",
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-t-[2px] after:bg-primary after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
      onClick={(e) => {
        if (props.onClick) {
          props.onClick(e);
        }
        trigger(defaultPatterns.success);
      }}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-6 focus-visible:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
