// Registry React Query hooks

import { useQuery } from "@tanstack/react-query";
import { useWalletUi } from "@wallet-ui/react";

import { registryFetcher } from "./fetcher";

export function useRegistry() {
  const { client } = useWalletUi();

  return useQuery({
    queryKey: ["registry"],
    queryFn: async () => {
      return await registryFetcher.getRegistry(client.rpc);
    },
  });
}
