import { useState } from "react";
import Link from "next/link";
import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import { useSession } from "next-auth/react";

import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";

function ProfilePopover({
  routes,
}: {
  routes: {
    url: string;
    name: string;
    icon?: string;
  }[];
}) {
  const user = useSession().data?.user;
  const [open, setopen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setopen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-3 transition-colors hover:cursor-pointer hover:text-primary">
          <Avatar
            sx={{ width: 24, height: 24 }}
            {...(user?.image && user.image !== "not_found" ? { src: user.image } : { children: "N" })}
            alt="user-icon"
          />
          <div className="hidden max-w-[120px] truncate text-sm text-muted-foreground md:block">#{user?.spotTradingAccountId}</div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        onClick={() => setopen(false)}
        className="mt-4 min-w-[220px] overflow-hidden rounded-lg border border-primary bg-background p-0 text-foreground shadow-lg"
      >
        {/* User Header */}
        <div className="flex items-center justify-between bg-primary/10 p-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase text-primary">{user?.name}</span>
            <span className="text-xs text-foreground/75">{user?.email ?? "not provided"}</span>
          </div>
          <Link href="/v1/Profile" prefetch className="text-xl font-bold text-primary">
            &gt;
          </Link>
        </div>

        {/* Mobile-only Navigation */}
        <ul className="divide-y divide-muted border-t border-muted bg-background lg:hidden">
          {[...routes, { url: "order_book", name: "Positions" }].map((item) => (
            <li key={item.name}>
              <Link prefetch href={item.url} className="flex items-center gap-3 p-3 transition-colors hover:bg-primary/10">
                {item.icon && <div className="fill-foreground">{item.icon}</div>}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="divide-y divide-muted border-t border-muted bg-background">
          {[{ url: "/api/auth/signout", name: "Logout", icon: <Logout /> }].map((item) => (
            <li key={item.name}>
              <Link prefetch href={item.url} className="flex items-center gap-3 p-3 transition-colors hover:bg-primary/10">
                <div className="fill-foreground">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default ProfilePopover;
