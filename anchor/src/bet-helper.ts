
import type { Bet } from '../target/types/bet'
import { Program, web3, BN } from '@coral-xyz/anchor'

export const TARGETED_TIME_TO_WIN_MS = 1000 * 60 * 60 * 24;

export const BET_FEE_RATIO = 0.01;

export function getDepositAddress(program: Program<Bet>, account: web3.PublicKey): web3.PublicKey {
  const [depositAddress] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("deposit"), account.toBuffer()],
    program.programId
  );
  return depositAddress;
}

export async function createBetTransaction(program: Program<Bet>, account:web3.PublicKey, bet_amount: number, deposit_amount?: number): Promise<web3.Transaction> {
  const total_amount = bet_amount + Math.ceil(bet_amount * BET_FEE_RATIO);
  const transaction = new web3.Transaction();
  transaction.add(
    await program.methods.createDeposit().accounts({
      bidder: account,
    }).transaction()
  );
  transaction.add(web3.SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: getDepositAddress(program, account),
    lamports: deposit_amount ? deposit_amount : total_amount,
  }));
  transaction.add(
    await program.methods
      .bet(new BN(bet_amount))
      .accounts({ bidder: account })
      .transaction()
  );
  return transaction;
}

export function getBetStatePublicKey(program: Program<Bet>): web3.PublicKey {
  const [key] = web3.PublicKey.findProgramAddressSync([Buffer.from("global")], program.programId);
  return key;
}