import { useWalletAccountTransactionSendingSigner, useWalletUi } from "@wallet-ui/react";

export function useWalletUiSigner(): ReturnType<typeof useWalletAccountTransactionSendingSigner> {
  const { account, cluster } = useWalletUi();
  const signer = useWalletAccountTransactionSendingSigner(account!, cluster.id);
  return signer;
}
