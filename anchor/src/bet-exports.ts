// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import BetIDL from '../target/idl/bet.json'
import type { Bet } from '../target/types/bet'

// Re-export the generated IDL and type
export { Bet, BetIDL }

// The programId is imported from the program IDL.
export const BET_PROGRAM_ID = new PublicKey(BetIDL.address)

// This is a helper function to get the Bet Anchor program.
export function getBetProgram(provider: AnchorProvider) {
  return new Program(BetIDL as Bet, provider)
}

// This is a helper function to get the program ID for the Bet program depending on the cluster.
export function getBetProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return BET_PROGRAM_ID
  }
}
