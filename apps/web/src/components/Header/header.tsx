"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";

import { issmallerThanDevice } from "@acme/lib";

import type { RootState } from "../redux/store";
import ThemeSwitch from "~/components/Header/ThemeSwitch";
import ProfilePopover from "./ProfilePopover";

const baseURL = "/";

function Header() {
  const lastRoute = usePathname().split("/").pop();

  return (
    <header
      className={twMerge(
        "relative flex w-full justify-center border-b-4 border-primary bg-background",
        "after:absolute after:left-0 after:top-[calc(100%+3px)] after:h-[50px] after:w-full after:bg-[#D3E0FB] dark:after:bg-[#0E2043]",
      )}
    >
      <div className="flex w-full p-2 px-4 pb-0">
        <div className="relative flex h-full grow items-center">
          <div className="flex items-center justify-center gap-5">
            <Image className=" " src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="" width={30} height={20} />
          </div>
          <NavigationButtons lastRoute={lastRoute} fullRoute={usePathname()} />
        </div>
      </div>
    </header>
  );
}

export { Header };
const Routes = [
  { url: "spot", name: "Spot", icon: "" },
  { url: "analyze", name: "Analyze", icon: "" },
  { url: "wallet", name: "Wallet", icon: "" },
];
const activeRouteClasses = [
  "relative bg-primary text-white",
  "before:absolute before:bottom-0 before:left-[-30px] before:h-[30px] before:w-[30px] before:rounded-full before:bg-background before:shadow-[15px_15px_0_hsl(var(--primary))]",
  "after:absolute after:bottom-0 after:right-[-30px] after:h-[30px] after:w-[30px] after:rounded-full after:bg-background after:shadow-[-15px_15px_0_hsl(var(--primary))]",
];
function NavigationButtons({ lastRoute }: { lastRoute?: string; fullRoute?: string }) {
  const size = useSelector((state: RootState) => state.DeviceType);

  return (
    <nav className="ml-6 flex grow items-center justify-between lg:mx-6">
      <div className="relative flex h-full items-center">
        {issmallerThanDevice("lg", size) ? (
          <Link prefetch href={baseURL + lastRoute} className={twMerge("relative mx-2 rounded-t-lg px-5 py-2 capitalize", activeRouteClasses)}>
            {lastRoute}
          </Link>
        ) : (
          Routes.map((x) => (
            <Link
              prefetch
              href={baseURL + x.url}
              className={twMerge("relative mx-2 rounded-t-lg px-5 py-2", lastRoute === x.url && activeRouteClasses)}
              key={x.name}
            >
              {x.name}
            </Link>
          ))
        )}
      </div>

      <div className="flex flex-row items-center gap-2">
        {/* <Settings className="mr-2 hidden border-r pr-2 lg:block" /> */}
        <ThemeSwitch className="mr-2 border-r pr-2" />
        <ProfilePopover routes={Routes} />
      </div>
    </nav>
  );
}
