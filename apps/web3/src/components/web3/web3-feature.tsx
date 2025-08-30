import { WalletButton } from '../solana/solana-provider'
import { Web3ButtonInitialize, Web3List, Web3ProgramExplorerLink, Web3ProgramGuard } from './web3-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function Web3Feature() {
  const { account } = useWalletUi()

  return (
    <Web3ProgramGuard>
      <AppHero
        title="Web3"
        subtitle={
          account
            ? "Initialize a new web3 onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <Web3ProgramExplorerLink />
        </p>
        {account ? (
          <Web3ButtonInitialize />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletButton />
          </div>
        )}
      </AppHero>
      {account ? <Web3List /> : null}
    </Web3ProgramGuard>
  )
}
