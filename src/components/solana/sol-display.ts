import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

function toFixed(value: number, precision: number): number {
  const power = Math.pow(10, precision || 0);
  return Math.round(value * power) / power;
}

export function RoundSol(sol: number): number {
  return toFixed(sol, 4);
}

export function FormatSol(sol: number): string {
  return `${RoundSol(sol)} SOL`;
}

export function FormatLamports(lamports: number): string {
  return FormatSol(LamportsToSol(lamports));
}

export function LamportsToSol(lamports: number): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
}

export function SolToLamports(sol: number): number {
  return sol * LAMPORTS_PER_SOL;
}

export function FormatPublicKeyShort(publicKey: PublicKey): string {
  return publicKey.toString()
}