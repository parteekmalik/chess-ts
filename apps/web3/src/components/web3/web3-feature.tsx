import { WalletButton } from '../solana/solana-provider'
import {
  Web3AccountList,
  Web3ProgramExplorerLink,
  Web3ProgramGuard
} from './web3-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function Web3Feature() {
  const { account } = useWalletUi()

  return (
    <Web3ProgramGuard>
      <AppHero
        title="Chess on Solana"
        subtitle={
          account
            ? "Initialize a chess registry and profile to start playing chess on Solana. Create matches, join games, and make moves on the blockchain."
            : 'Select a wallet to start playing chess on Solana.'
        }
      >
        <p className="mb-6">
          <Web3ProgramExplorerLink />
        </p>
        {!account && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <Web3AccountList /> : null}
    </Web3ProgramGuard>
  )
}
