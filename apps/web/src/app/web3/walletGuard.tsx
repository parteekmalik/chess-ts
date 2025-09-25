import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@acme/ui/card"
import { useWalletUi, WalletUiDropdown } from "@wallet-ui/react"
import { ReactNode } from "react"

// Wallet connection guard component
export function WalletConnectionGuard({ children }: { children: ReactNode }) {
  const { account } = useWalletUi()

  if (!account) {
    return (
      <div className="flex mt-[30vh] justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your Solana wallet to start playing chess on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex justify-center">
              <WalletUiDropdown />
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              You need a Solana wallet to create profiles, join matches, and play chess
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}