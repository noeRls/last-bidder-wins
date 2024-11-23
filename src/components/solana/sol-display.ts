import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

function toFixed(value: number, precision: number): string {
  const power = Math.pow(10, precision || 0);
  return String(Math.round(value * power) / power);
}

export function FormatSol(sol: number): string {
  return `${toFixed(sol, 4)} SOL`;
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