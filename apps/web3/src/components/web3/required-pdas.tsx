import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import {
  useRegistryQuery,
  useConnectedWalletProfileQuery,
  useInitializeRegistryMutation,
  useInitializeProfileMutation,
  useInvalidateAll
} from './web3-data-access'

export function RequiredPdas() {
  const { account } = useWalletUi()
  const registryQuery = useRegistryQuery()
  const profileQuery = useConnectedWalletProfileQuery()

  const needsRegistry = registryQuery.data === null
  const needsProfile = profileQuery.data === null
  const hasWallet = !!account

  // Don't show anything if wallet is not connected
  if (!hasWallet) {
    return null
  }

  // Don't show anything if both PDAs exist
  if (!needsRegistry && !needsProfile) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Accounts</CardTitle>
        <CardDescription>
          {needsRegistry && needsProfile
            ? 'You need to create a registry and profile to start playing chess'
            : needsRegistry
              ? 'You need to create a registry to start playing chess'
              : 'You need to create a profile to start playing chess'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          {needsRegistry && <InitializeRegistryButton />}
          {needsProfile && <InitializeProfileButton />}
        </div>
      </CardContent>
    </Card>
  )
}

function InitializeRegistryButton() {
  const mutation = useInitializeRegistryMutation()
  const invalidateAll = useInvalidateAll()

  const handleInitialize = async () => {
    try {
      await mutation.mutateAsync()
      await invalidateAll()
    } catch (error) {
      console.error('Failed to initialize registry:', error)
    }
  }

  return (
    <Button
      onClick={handleInitialize}
      disabled={mutation.isPending}
      className="w-full"
    >
      {mutation.isPending ? 'Creating Registry...' : 'Create Registry'}
    </Button>
  )
}

function InitializeProfileButton() {
  const [profileName, setProfileName] = useState('')

  const mutation = useInitializeProfileMutation()
  const invalidateAll = useInvalidateAll()

  const handleInitialize = async () => {
    if (!profileName.trim()) return

    try {
      await mutation.mutateAsync(profileName)
      await invalidateAll()
      setProfileName('') // Clear input after success
    } catch (error) {
      console.error('Failed to initialize profile:', error)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="profile-name">Profile Name</Label>
      <Input
        id="profile-name"
        type="text"
        placeholder="Enter your profile name"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
      />
      <Button
        onClick={handleInitialize}
        disabled={mutation.isPending || !profileName.trim()}
        className="w-full"
      >
        {mutation.isPending ? 'Creating Profile...' : 'Create Profile'}
      </Button>
    </div>
  )
}
