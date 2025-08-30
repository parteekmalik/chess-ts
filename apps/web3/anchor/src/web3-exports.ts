// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, address, getBase58Decoder, SolanaClient } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Web3, WEB3_DISCRIMINATOR, WEB3_PROGRAM_ADDRESS, getWeb3Decoder } from './client/js'
import Web3IDL from '../target/idl/web3.json'

export type Web3Account = Account<Web3, string>

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

export function getWeb3ProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getWeb3Decoder(),
    filter: getBase58Decoder().decode(WEB3_DISCRIMINATOR),
    programAddress: WEB3_PROGRAM_ADDRESS,
  })
}
