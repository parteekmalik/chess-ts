// Here we export some useful types and functions for interacting with the Anchor program.
import { SolanaClusterId } from '@wallet-ui/react'
import { Account, SolanaClient } from 'gill'
import Web3IDL from '../target/idl/web3.json'

// Helper function to convert Uint8Array to base58 string for RPC filters
function uint8ArrayToBase58(bytes: Uint8Array): string {
  // Simple base58 encoding
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let num = BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''))
  let result = ''

  while (num > 0n) {
    result = alphabet[Number(num % 58n)] + result
    num = num / 58n
  }

  // Add leading '1's for leading zeros
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    result = '1' + result
  }

  return result
}
import { WEB3_PROGRAM_ADDRESS } from './client/js'
import {
  ChessMatch,
  getChessMatchDecoder,
  CHESS_MATCH_DISCRIMINATOR
} from './client/js/generated/accounts/chessMatch'
import {
  getProfileDecoder,
  PROFILE_DISCRIMINATOR,
  Profile,
  fetchProfile
} from './client/js/generated/accounts/profile'
import {
  getRegistryDecoder,
  REGISTRY_DISCRIMINATOR,
  Registry
} from './client/js/generated/accounts/registry'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { getProgramDerivedAddress, getAddressEncoder, Address } from 'gill'
import { expectAddress } from './client/js/generated/shared'

export type Web3Account = Account<Registry, string> | Account<Profile, string> | Account<ChessMatch, string>

// Re-export the generated IDL and type
export { Web3IDL }

// This is a helper function to get the program ID for the Web3 program depending on the cluster.
export function getWeb3ProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
    // This is the program ID for the Web3 program on devnet and testnet.
    // return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return WEB3_PROGRAM_ADDRESS
  }
}

export * from './client/js'

// Separate functions with proper typing
export async function getRegistryAccount(rpc: SolanaClient['rpc']): Promise<Account<Registry, string> | null> {
  try {
    const registryFilter = uint8ArrayToBase58(REGISTRY_DISCRIMINATOR)
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getRegistryDecoder(),
      filter: registryFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    })
    return accounts[0] || null
  } catch (error) {
    console.error('❌ Failed to fetch Registry accounts:', error)
    return null
  }
}

export async function getProfileAccounts(rpc: SolanaClient['rpc']): Promise<Account<Profile, string>[]> {
  try {
    const profileFilter = uint8ArrayToBase58(PROFILE_DISCRIMINATOR)
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getProfileDecoder(),
      filter: profileFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    })
    return accounts
  } catch (error) {
    console.error('❌ Failed to fetch Profile accounts:', error)
    return []
  }
}

export async function getChessMatchAccounts(rpc: SolanaClient['rpc']): Promise<Account<ChessMatch, string>[]> {
  try {
    const chessMatchFilter = uint8ArrayToBase58(CHESS_MATCH_DISCRIMINATOR)
    const accounts = await getProgramAccountsDecoded(rpc, {
      decoder: getChessMatchDecoder(),
      filter: chessMatchFilter,
      programAddress: WEB3_PROGRAM_ADDRESS,
    })
    return accounts
  } catch (error) {
    console.error('❌ Failed to fetch ChessMatch accounts:', error)
    return []
  }
}

// Derive profile PDA for a given wallet address
export async function getProfilePda(walletAddress: Address): Promise<Address> {
  const [pda] = await getProgramDerivedAddress({
    programAddress: WEB3_PROGRAM_ADDRESS,
    seeds: [getAddressEncoder().encode(expectAddress(walletAddress))],
  })
  return pda
}

// Fetch profile by wallet address (derives PDA and fetches)
export async function getProfileByWallet(rpc: SolanaClient['rpc'], walletAddress: Address): Promise<Account<Profile, string> | null> {
  try {
    const profileAddress = await getProfilePda(walletAddress)
    return await fetchProfile(rpc, profileAddress)
  } catch {
    console.log('profile not found for connected wallet')
    return null
  }
}