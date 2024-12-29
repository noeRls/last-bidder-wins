import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'

function toFixed(value: number, precision: number, maxPrecision: number): number {
  const power = Math.pow(10, precision || 0);
  const result = Math.round(value * power) / power;
  if (result == 0 && value != 0 && precision < maxPrecision) {
    return toFixed(value, precision + 1, maxPrecision)
  }
  return result;
}

export function RoundSol(sol: number): number {
  return toFixed(sol, 4, 6);
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