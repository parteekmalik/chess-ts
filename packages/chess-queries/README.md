# @acme/chess-queries

A React Query package for managing chess game state and blockchain interactions in your Solana chess application.

## Features

- **React Query Integration** - Built on top of `@tanstack/react-query`
- **Chess Game Management** - Complete CRUD operations for chess matches
- **Profile Management** - User profile initialization and management
- **Real-time Updates** - Automatic query invalidation and refetching
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Wallet Integration** - Built for `@wallet-ui/react` and Solana

## Installation

```bash
pnpm add @acme/chess-queries
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { ChessQueryProvider } from "@acme/chess-queries";

function App() {
  return (
    <ChessQueryProvider>
      <YourChessApp />
    </ChessQueryProvider>
  );
}
```

### 2. Use the hooks in your components

```tsx
import { useChessAccounts, useChessProgram, useCreateChessMatchMutation, useMakeMoveMutation } from "@acme/chess-queries";

function ChessGame() {
  const { data: program } = useChessProgram();
  const { data: accounts } = useChessAccounts();
  const createMatch = useCreateChessMatchMutation();
  const makeMove = useMakeMoveMutation();

  const handleCreateMatch = () => {
    createMatch.mutate({
      matchId: 1,
      baseTimeSeconds: 600,
      incrementSeconds: 30,
    });
  };

  return (
    <div>
      <button onClick={handleCreateMatch}>Create New Match</button>
    </div>
  );
}
```

## Available Hooks

### Queries

- `useChessProgram()` - Get program account info
- `useChessProgramId()` - Get program ID for current cluster
- `useChessAccounts()` - Get all chess accounts
- `useChessProfile(profileId)` - Get specific profile
- `useChessMatch(matchId)` - Get specific chess match

### Mutations

- `useInitializeProfileMutation()` - Initialize user profile
- `useCreateChessMatchMutation()` - Create new chess match
- `useJoinChessMatchMutation()` - Join existing match
- `useMakeMoveMutation()` - Make chess move
- `useCloseChessMatchMutation()` - Close finished match

## Query Keys

The package provides a structured query key system:

```tsx
import { chessQueryKeys } from "@acme/chess-queries";

// Use in your own queries or mutations
const queryClient = useQueryClient();

await queryClient.invalidateQueries({
  queryKey: chessQueryKeys.accounts(clusterId),
});
```

## Types

```tsx
import type {
  ChessMatch,
  ChessProfile,
  CloseChessMatchParams,
  CreateChessMatchParams,
  JoinChessMatchParams,
  MakeMoveParams,
} from "@acme/chess-queries";
```

## Utilities

```tsx
import { calculateTimeControl, formatTime, isGameActive, isValidFEN, showError, showSuccess } from "@acme/chess-queries";
```

## Example Usage

See `src/examples/usage.tsx` for a complete example component.

## Dependencies

- `@tanstack/react-query` - React Query library
- `@acme/anchor` - Anchor program integration
- `@wallet-ui/react` - Wallet integration
- `gill` - Solana client library

## Development

```bash
# Type checking
pnpm typecheck

# Build
pnpm build

# Watch mode
pnpm build:watch
```

## License

MIT
