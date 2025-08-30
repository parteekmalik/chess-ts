# @acme/anchor

A TypeScript package that provides generated Anchor program client code and utilities for Solana blockchain development.

## Features

- **Generated Anchor Client Code** - Auto-generated TypeScript bindings for your Anchor programs
- **TypeScript Support** - Full TypeScript support with type definitions
- **Solana Integration** - Built on top of `gill` library for Solana development
- **Program Account Management** - Utilities for fetching and decoding program accounts
- **Direct File Access** - Import specific files directly without building

## Installation

```bash
pnpm add @acme/anchor
```

## Usage

### Main Package Import

```typescript
import { getChessMatchDecoder, getProfileDecoder, getWeb3ProgramId } from "@acme/anchor";
```

### Direct File Access

```typescript
// Access specific instructions directly
import { ChessMatch, getChessMatchDecoder } from "@acme/anchor/accounts/chessMatch";
// Access account types directly

// Access decoders directly
import { getProfileDecoder, Profile } from "@acme/anchor/accounts/profile";
import { Registry } from "@acme/anchor/accounts/registry";
// Access helper functions directly
import { getProgramAccountsDecoded } from "@acme/anchor/helpers/get-program-accounts-decoded";
import { getCreateChessMatchInstruction } from "@acme/anchor/instructions/createChessMatch";
import { getInitializeProfileInstruction } from "@acme/anchor/instructions/initializeProfile";
import { getMakeMoveInstruction } from "@acme/anchor/instructions/makeMove";
```

### Pattern-Based Imports

```typescript
// Import from generated directories
import { getProfileDecoder } from "@acme/anchor/generated/accounts/profile";
import { getCreateChessMatchInstruction } from "@acme/anchor/generated/instructions/createChessMatch";

// Import from client directories
import { getProfileDecoder } from "@acme/anchor/client/js/generated/accounts/profile";
```

### Working with Program Accounts

```typescript
import { getProfileDecoder } from "@acme/anchor/accounts/profile";
import { getProgramAccountsDecoded } from "@acme/anchor/helpers/get-program-accounts-decoded";

async function getProfiles(rpc: SolanaClient["rpc"]) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getProfileDecoder(),
    filter: getProfileDiscriminatorBytes(),
    programAddress: programId,
  });
}
```

### Creating Instructions

```typescript
import { getCreateChessMatchInstruction } from "@acme/anchor/instructions/createChessMatch";

const instruction = getCreateChessMatchInstruction({
  payer: signer,
  chessMatch: chessMatchAddress,
  registry: registryAddress,
  profile: profileAddress,
  matchId: 1n,
  baseTimeSeconds: 600,
  incrementSeconds: 30,
});
```

## Export Patterns

The package provides several export patterns for flexible usage:

### Main Export (`"."`)

```typescript
import { getWeb3ProgramId } from "@acme/anchor";
```

### Source Files (`"./src/*"`)

```typescript
import { getWeb3ProgramId } from "@acme/anchor/src/web3-exports";
```

### Client Code (`"./client/*"`)

```typescript
import { getProfileDecoder } from "@acme/anchor/client/js/generated/accounts/profile";
```

### Generated Code (`"./generated/*"`)

```typescript
import { getCreateChessMatchInstruction } from "@acme/anchor/generated/instructions/createChessMatch";
```

### Specific Categories

```typescript
// Instructions
import { ChessMatch } from "@acme/anchor/accounts/chessMatch";
// Accounts
import { Profile } from "@acme/anchor/accounts/profile";
// Errors
import { ChessMatchError } from "@acme/anchor/errors/chessMatch";
import { getCreateChessMatchInstruction } from "@acme/anchor/instructions/createChessMatch";
import { getJoinChessMatchInstruction } from "@acme/anchor/instructions/joinChessMatch";
import { getMakeMoveInstruction } from "@acme/anchor/instructions/makeMove";
// Types
import { MatchStatus } from "@acme/anchor/types/matchStatus";
import { MoveRecord } from "@acme/anchor/types/moveRecord";
```

## Package Structure

```
src/
├── index.ts                 # Main exports
├── web3-exports.ts         # Program-specific exports
├── client/                 # Generated client code
│   └── js/
│       └── generated/
│           ├── accounts/   # Account types and decoders
│           ├── instructions/ # Instruction builders
│           ├── types/      # Custom types
│           └── errors/     # Error types
└── helpers/                # Utility functions
    └── get-program-accounts-decoded.ts
```

## Development

### Type Checking

```bash
# Type checking only (no build required)
pnpm typecheck
```

### Building (Optional)

```bash
# Build the package to JavaScript
pnpm build

# Watch mode
pnpm build:watch
```

### Regenerating Client Code

```bash
# Run codama to regenerate client code
pnpm codama:js

# Or run the full setup
pnpm setup
```

## Dependencies

- `gill` - Solana development library
- `@wallet-ui/react` - Wallet integration
- `@solana/webcrypto-ed25519-polyfill` - Browser crypto support

## License

MIT
