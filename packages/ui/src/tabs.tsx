"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from ".";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { indicatorClassName?: string }
>(({ className, indicatorClassName, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = useState({
    posiotion: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    },
    color: "" as string | null,
  });
  const tabsListRef = useRef<HTMLDivElement | null>(null);

  const updateIndicator = React.useCallback(() => {
    if (!tabsListRef.current) return;

    const activeTab = tabsListRef.current.querySelector<HTMLElement>('[data-state="active"]');
    if (!activeTab) return;

    const activeRect = activeTab.getBoundingClientRect();
    const tabsRect = tabsListRef.current.getBoundingClientRect();

    requestAnimationFrame(() => {
      setIndicatorStyle({
        posiotion: {
          left: activeRect.left - tabsRect.left,
          top: activeRect.top - tabsRect.top,
          width: activeRect.width,
          height: activeRect.height,
        },
        color: activeTab.getAttribute("color"),
      });
    });
  }, []);

  useEffect(() => {
    // Initial update
    const timeoutId = setTimeout(updateIndicator, 0);

    // Event listeners
    window.addEventListener("resize", updateIndicator);
    const observer = new MutationObserver(updateIndicator);

    if (tabsListRef.current) {
      observer.observe(tabsListRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
      observer.disconnect();
    };
  }, [updateIndicator]);

  return (
    <div className="relative" ref={tabsListRef}>
      <TabsPrimitive.List
        ref={ref}
        className={cn("relative inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}
        {...props}
      />
      <div
        className={cn(
          "absolute rounded-md bg-background shadow-sm transition-[top,_left,_right,_bottom,_background-color,_color] duration-300 ease-in-out",
          indicatorStyle.color,
          indicatorClassName,
        )}
        style={indicatorStyle.posiotion}
      />
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "z-10 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 pb-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      style={{ maxHeight: "calc(100% - 36px)" }}
      {...props}
    />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
