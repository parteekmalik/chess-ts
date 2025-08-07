"use client";

import { useQuery } from "@tanstack/react-query";

import { cn } from "@acme/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";

import { useTRPC } from "~/trpc/react";

const defaultUserDetails = {
  name: "Junior Garcia",
  email: "@jrgarciadev",
  image: "https://avatars.githubusercontent.com/u/30373425?v=4",
};

export function UserCard({ userId, minimal }: { userId?: string; minimal?: boolean }) {
  const trpc = useTRPC();
  const { data: actualUser } = useQuery(trpc.liveGame.getUser.queryOptions(userId!, { enabled: !!userId }));
  const user = userId ? actualUser : defaultUserDetails;
  const imageSrc = user?.image;
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className={cn("flex w-fit items-center gap-4 p-0", minimal && "hidden lg:block")}>
      <Avatar>{imageSrc ? <AvatarImage src={imageSrc} alt={user.name!} /> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>
      <div>
        <p className="text-sm font-medium">{user?.name}</p>
        {/* TODO: Implement Pieces capured */}
        <div className="invisible">1</div>
      </div>
    </div>
  );
}
