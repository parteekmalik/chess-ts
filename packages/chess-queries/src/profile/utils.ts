import { z } from "zod";
import type { Account } from "gill";

import type { Profile } from "@acme/anchor";

export const ProfileAccountSchema = z.object({
  discriminator: z.instanceof(Uint8Array),
  accType: z.number(),
  address: z.string(),
  wallet: z.string(),
  rating: z.number(),
  wins: z.number(),
  losses: z.number(),
  draws: z.number(),
  displayName: z.string(),
  matches: z.array(z.number()),
});

export type ProfileAccount = z.infer<typeof ProfileAccountSchema>;

export function profileProcessor(account: Account<Profile, string>): ProfileAccount {
  return {
    discriminator: new Uint8Array(account.data.discriminator),
    accType: account.data.accType,
    address: account.address,
    wallet: account.data.wallet,
    rating: account.data.rating,
    wins: account.data.wins,
    losses: account.data.losses,
    draws: account.data.draws,
    displayName: account.data.displayName,
    matches: account.data.matches.map((match) => Number(match)),
  };
}
