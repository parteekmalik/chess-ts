"use client";

import { useEffect, useState } from "react";
import LinkN from "next/link";
import { BarChart2, Link, Star } from "lucide-react";

import type { ProfileAccount } from "@acme/chess-queries";
import { formatAddress } from "@acme/lib";
import { cn } from "@acme/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Badge } from "@acme/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@acme/ui/dialog";
import { SegmetedBar } from "@acme/ui/SegmetedBar";

import { ProfilePage } from "../components/app/ProfilePage";

interface ProfileCardProps {
  profile: ProfileAccount;
  className?: string;
}

export function ProfileCard({ profile, className }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const { displayName, address, wallet, rating, wins, losses, draws } = profile;

  const totalFromStats = wins + losses + draws;
  const winRate = Math.round((wins / totalFromStats) * 100);

  const shortAddr = formatAddress(String(address));

  // copy feedback
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(t);
  }, [copied]);

  const initials = displayName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog>
      {/* Trigger: whole card is clickable to open the dialog */}
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            `duration-250 w-full max-w-sm transform-gpu overflow-hidden rounded-xl border border-stone-200 bg-background shadow-[0_6px_30px_rgba(2,6,23,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(2,6,23,0.12)] focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:border-stone-700`,
            className,
          )}
        >
          <Card key={wallet} className="w-full bg-transparent shadow-none">
            {/* header row: avatar | name + addr | rating + copy */}
            <CardHeader className="px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex-none">
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback className="bg-primary/80">{initials}</AvatarFallback>
                  </Avatar>
                </div>

                {/* name & short address */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      <CardTitle className="m-0 p-0">
                        <div className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{displayName}</div>
                      </CardTitle>
                      <div className="mt-0.5 truncate text-xs text-stone-400">{shortAddr}</div>
                    </div>

                    {/* rating badge + copy button */}
                    <div className="ml-3 flex flex-none items-center gap-2">
                      <Badge className="inline-flex gap-1 bg-primary/60 text-sm text-white" title={`Rating: ${rating}`}>
                        <Star className="h-4 w-4" />
                        <span className="font-medium">{rating}</span>
                      </Badge>

                      <LinkN
                        href={`profile/${address}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-stone-200 transition hover:border-stone-300"
                      >
                        <Link className="h-4 w-4 text-stone-500" />
                      </LinkN>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-2">
              <div className="mb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-primary" />
                        <span>Wins</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-muted-foreground" />
                        <span>Draws</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-sm bg-destructive" />
                        <span>Losses</span>
                      </div>
                    </div>
                    <div />
                  </div>

                  {/* middle: win rate */}
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <BarChart2 className="h-4 w-4 text-stone-400" />
                    <span className="font-medium text-white/80">{winRate}%</span>
                    <span className="text-xs text-stone-400">win rate</span>
                  </div>
                </div>
              </div>

              <SegmetedBar
                segments={[
                  { value: wins, color: "bg-primary" },
                  { value: draws, color: "bg-muted-foreground" },
                  { value: losses, color: "bg-destructive" },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>

      {/* Dialog content from shadcn — replace the placeholder body with your own content */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <ProfilePage profileAddress={profile.address} />
      </DialogContent>
    </Dialog>
  );
}
