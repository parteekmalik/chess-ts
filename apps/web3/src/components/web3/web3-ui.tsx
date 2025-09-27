import { ellipsify } from '@wallet-ui/react'
import {
  fetcher,
  useProgram,
  useProgramId,
  useCreateChessMatchMutation,
  useJoinChessMatchMutation,
  useMakeMoveMutation,
} from './web3-data-access'
import { RequiredPdas } from './required-pdas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExplorerLink } from '../cluster/cluster-ui'
import { ChessMatch, Profile, Registry } from '@project/anchor'
import { ReactNode, useState } from 'react'
import { Account, Address } from 'gill'

export function Web3ProgramExplorerLink() {
  const programId = useProgramId()

  return <ExplorerLink className='text-sm lg:text-base' address={programId.toString()} label={programId.toString()} />
}

export function Web3AccountList() {
  const chessMatchQuery = fetcher.chessMatches()
  const profileQuery = fetcher.profiles()
  const registryQuery = fetcher.registry()
  const [showProfiles, setShowProfiles] = useState(false)

  if (chessMatchQuery.isLoading || profileQuery.isLoading || registryQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  const hasAnyAccounts = (chessMatchQuery.data?.length ?? 0) > 0 ||
    (profileQuery.data?.length ?? 0) > 0 ||
    (registryQuery.data !== null)

  if (!hasAnyAccounts) {
    return (
      <div className="text-center space-y-4">
        <h2 className={'text-2xl'}>No chess accounts found</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Show required PDAs component */}
      <RequiredPdas />

      {/* Show chess actions at the top */}
      <Card>
        <CardHeader>
          <CardTitle>Chess Actions</CardTitle>
          <CardDescription>Create matches, join games, and make moves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Web3ButtonCreateChessMatch />
        </CardContent>
      </Card>

      {/* Show existing accounts */}
      <div className="space-y-6">
        {/* Registry accounts */}
        {registryQuery.data && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Registry Accounts</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <RegistryCard account={registryQuery.data} />
            </div>
          </div>
        )}

        {/* Profile accounts */}
        {profileQuery.data && profileQuery.data.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Profile Accounts</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfiles(!showProfiles)}
              >
                {showProfiles ? 'Hide' : 'Show'} Profiles
              </Button>
            </div>
            {showProfiles && (
              <div className="grid lg:grid-cols-2 gap-4">
                {profileQuery.data.map((account) => (
                  <ProfileCard key={account.address} account={account} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chess match accounts */}
        {chessMatchQuery.data && chessMatchQuery.data.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Chess Match Accounts</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              {chessMatchQuery.data.map((account) => (
                <ChessMatchCard key={account.address} account={account} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function RegistryAccountList() {
  const registryQuery = fetcher.registry()

  if (registryQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!registryQuery.data) {
    return (
      <div className="text-center space-y-4">
        <h2 className={'text-2xl'}>No registry found</h2>
        <p>Please connect your wallet to create accounts.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <RegistryCard account={registryQuery.data} />
    </div>
  )
}

export function ProfileAccountList() {
  const profileQuery = fetcher.profiles()

  if (profileQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!profileQuery.data?.length) {
    return (
      <div className="text-center space-y-4">
        <h2 className={'text-2xl'}>No profiles found</h2>
        <p>Please connect your wallet to create accounts.</p>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {profileQuery.data?.map((account) => (
        <ProfileCard key={account.address} account={account} />
      ))}
    </div>
  )
}

export function ChessMatchAccountList() {
  const chessMatchQuery = fetcher.chessMatches()

  if (chessMatchQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!chessMatchQuery.data?.length) {
    return (
      <div className="text-center space-y-4">
        <h2 className={'text-2xl'}>No chess matches found</h2>
        <p>Create or join a chess match to start playing.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-4">
        {chessMatchQuery.data?.map((account) => (
          <ChessMatchCard key={account.address} account={account} />
        ))}
      </div>
    </div>
  )
}

export function Web3ProgramGuard({ children }: { children: ReactNode }) {
  const programAccountQuery = useProgram()

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
function RegistryCard({ account }: { account: Account<Registry, string> }) {
  if (!account.data) {
    return <div>Data not found</div>
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registry Account</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={account.address} label={ellipsify(account.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Matches Played: {account.data.matchesPlayed}</p>
          <p>Matches Pending: {account.data.matchesPending}</p>
          <p>Matches Playing: {account.data.matchesPlaying}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileCard({ account }: { account: Account<Profile, string> }) {
  if (!account.data) {
    return <div>Data not found</div>
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Account</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={account.address} label={ellipsify(account.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Display Name: {account.data.displayName}</p>
          <p>Rating: {account.data.rating}</p>
          <p>Wins: {account.data.wins} | Losses: {account.data.losses} | Draws: {account.data.draws}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ChessMatchCard({ account }: { account: Account<ChessMatch, string> }) {
  const joinMatchMutation = useJoinChessMatchMutation()
  const makeMoveMutation = useMakeMoveMutation()
  const [moveFen, setMoveFen] = useState('')

  if (!account.data) {
    return <div>Data not found</div>
  }

  // Check if match needs a join button (either white or black is None)
  const needsJoin = account.data.white.__option === "None" || account.data.black.__option === "None"
  const isMatched = account.data.white.__option === "Some" && account.data.black.__option === "Some"

  const handleJoin = () => {
    joinMatchMutation.mutateAsync({ chessMatch: account.address as Address })
  }

  const handleMakeMove = () => {
    if (moveFen.trim()) {
      makeMoveMutation.mutateAsync({
        chessMatch: account.address as Address,
        moveFenStr: moveFen
      })
      setMoveFen('') // Clear input after move
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match #{account.data.id}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink address={account.address} label={ellipsify(account.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>Status: {account.data.status}</p>
          <p>Result: {account.data.result}</p>
          <p>Base Time: {account.data.baseTimeSeconds}s</p>
          <p>Increment: {account.data.incrementSeconds}s</p>
          <p>Fen: {account.data.fen}</p>
          <p>Moves: {account.data.moves.map((move) => move.san).join(', ')}</p>
          <p>Ends At: {account.data.endsAt.__option === "Some" ? (() => {
            const endTime = Number(account.data.endsAt.value) * 1000;
            const now = Date.now();
            const timeLeft = Math.max(0, endTime - now);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            return `${minutes}m ${seconds}s left`;
          })() : "Not set"}</p>
          <p>Abandonment At: {account.data.abandonmentAt.__option === "Some" ? (() => {
            const endTime = Number(account.data.abandonmentAt.value) * 1000;
            const now = Date.now();
            const timeLeft = Math.max(0, endTime - now);
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            return `${minutes}m ${seconds}s left`;
          })() : "Not set"}</p>

          {needsJoin && (
            <Button
              onClick={handleJoin}
              disabled={joinMatchMutation.isPending}
              className="w-full"
            >
              {joinMatchMutation.isPending ? 'Joining...' : 'Join Match'}
            </Button>
          )}

          {isMatched && (
            <div className="space-y-2 pt-2 border-t">
              <Label htmlFor={`move-fen-${account.address}`}>Make Move (FEN)</Label>
              <div className="flex gap-2">
                <Input
                  id={`move-fen-${account.address}`}
                  type="text"
                  placeholder="e.g., e2e4"
                  value={moveFen}
                  onChange={(e) => setMoveFen(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleMakeMove}
                  disabled={makeMoveMutation.isPending || !moveFen.trim()}
                  size="sm"
                >
                  {makeMoveMutation.isPending ? 'Moving...' : 'Move'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


export function Web3ButtonCreateChessMatch() {
  const createMatchMutation = useCreateChessMatchMutation()
  const [baseTime, setBaseTime] = useState('300')
  const [increment, setIncrement] = useState('5')

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="base-time">Base Time (seconds)</Label>
        <Input
          id="base-time"
          type="number"
          placeholder="300"
          value={baseTime}
          onChange={(e) => setBaseTime(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="increment">Increment (seconds)</Label>
        <Input
          id="increment"
          type="number"
          placeholder="5"
          value={increment}
          onChange={(e) => setIncrement(e.target.value)}
        />
      </div>
      <Button
        onClick={() => createMatchMutation.mutateAsync({
          baseTimeSeconds: parseInt(baseTime),
          incrementSeconds: parseInt(increment)
        })}
        disabled={createMatchMutation.isPending || !baseTime || !increment}
      >
        Create Chess Match {createMatchMutation.isPending && '...'}
      </Button>
    </div>
  )
}


