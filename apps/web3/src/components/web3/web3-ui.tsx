import { ellipsify } from '@wallet-ui/react'
import {
  useWeb3AccountsQuery,
  useWeb3CloseMutation,
  useWeb3DecrementMutation,
  useWeb3IncrementMutation,
  useWeb3InitializeMutation,
  useWeb3Program,
  useWeb3ProgramId,
  useWeb3SetMutation,
} from './web3-data-access'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExplorerLink } from '../cluster/cluster-ui'
import { Web3Account } from '@project/anchor'
import { ReactNode } from 'react'

export function Web3ProgramExplorerLink() {
  const programId = useWeb3ProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function Web3List() {
  const web3AccountsQuery = useWeb3AccountsQuery()

  if (web3AccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!web3AccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {web3AccountsQuery.data?.map((web3) => (
        <Web3Card key={web3.address} web3={web3} />
      ))}
    </div>
  )
}

export function Web3ProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useWeb3Program()

  if (programAccountQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!programAccountQuery.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }

  return children
}

function Web3Card({ web3 }: { web3: Web3Account }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Web3: {web3.data.count}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={web3.address} label={ellipsify(web3.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <Web3ButtonIncrement web3={web3} />
          <Web3ButtonSet web3={web3} />
          <Web3ButtonDecrement web3={web3} />
          <Web3ButtonClose web3={web3} />
        </div>
      </CardContent>
    </Card>
  )
}

export function Web3ButtonInitialize() {
  const mutationInitialize = useWeb3InitializeMutation()

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Web3 {mutationInitialize.isPending && '...'}
    </Button>
  )
}

export function Web3ButtonIncrement({ web3 }: { web3: Web3Account }) {
  const incrementMutation = useWeb3IncrementMutation({ web3 })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}

export function Web3ButtonSet({ web3 }: { web3: Web3Account }) {
  const setMutation = useWeb3SetMutation({ web3 })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', web3.data.count.toString() ?? '0')
        if (!value || parseInt(value) === web3.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}

export function Web3ButtonDecrement({ web3 }: { web3: Web3Account }) {
  const decrementMutation = useWeb3DecrementMutation({ web3 })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}

export function Web3ButtonClose({ web3 }: { web3: Web3Account }) {
  const closeMutation = useWeb3CloseMutation({ web3 })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
