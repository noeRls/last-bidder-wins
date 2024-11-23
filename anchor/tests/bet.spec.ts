import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Bet } from '../target/types/bet'
import { Clock, startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { createBetTransaction, getBetStatePublicKey, TARGETED_TIME_TO_WIN_MS } from "../src/bet-helper";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const IDL = require("../target/idl/bet.json");

const { SystemProgram, Transaction, LAMPORTS_PER_SOL } = anchor.web3;

function toSol(lamports: number): number {
  return lamports * LAMPORTS_PER_SOL;
}

const MS_PER_SLOT = 400;
const slot_to_win = TARGETED_TIME_TO_WIN_MS / MS_PER_SLOT;

describe('lastbidderwin', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const program = anchor.workspace.Bet as Program<Bet>
  const payer = provider.wallet as anchor.Wallet

  const betStatePublicKey = getBetStatePublicKey(program);

  async function createAccount(lamports: number): Promise<Keypair> {
    const account = Keypair.generate();
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: account.publicKey,
        lamports: lamports,
      })
    );
    await provider.sendAndConfirm(transaction);
    return account;
  }

  it('Initialize the program', async () => {
    await program.methods
      .setup()
      .accounts({
        payer: payer.publicKey,
      })
      .rpc()

    const allAccounts = await program.account.betState.all();
    expect(allAccounts).toHaveLength(1);

    const betState = await program.account.betState.fetch(betStatePublicKey)

    expect(Number(betState.lastBetValue)).toEqual(0);
    expect(Number(betState.winAtSlot)).toEqual(0);
    expect(Number(betState.prizepool)).toEqual(0);
    expect(betState.lastBetAccount).toEqual(anchor.web3.PublicKey.default);
  });

  it('Can not initialize the program again', async () => {
    try {
      await program.methods
        .setup()
        .accounts({
          payer: payer.publicKey,
        })
        .rpc();
      fail("Could init the program again");
    } catch (_err) {
      expect(_err).toBeInstanceOf(anchor.web3.SendTransactionError);
      const err = _err as anchor.web3.SendTransactionError;
      expect(err.message).toContain("already in use");
    }
  });

  it('Can bet', async () => {
    const account = await createAccount(toSol(10));

    const transaction = await createBetTransaction(program, account.publicKey, toSol(5));
    await provider.sendAndConfirm(transaction, [account]);

    const betState = await program.account.betState.fetch(betStatePublicKey)
    expect(betState.lastBetAccount).toEqual(account.publicKey);
    expect(Number(betState.lastBetValue)).toEqual(toSol(5));
    expect(Number(betState.prizepool)).toEqual(toSol(5));

    const currentSlot = await provider.connection.getSlot();
    expect(Number(betState.winAtSlot)).toEqual(currentSlot + slot_to_win);
  });

  it('Refund money if betting failed', async () => {
    const account = await createAccount(toSol(2));

    const transaction = await createBetTransaction(program, account.publicKey, toSol(1));
    try {
      await provider.sendAndConfirm(transaction, [account]);
      fail("The bet should fail");
    } catch (_err) {
      expect(_err).toBeInstanceOf(anchor.web3.SendTransactionError);
      const err = _err as anchor.web3.SendTransactionError;
      expect(err.message).toContain("TooSmallBet");
      expect(await provider.connection.getBalance(account.publicKey)).toEqual(toSol(2));
    }
  });

  it('Can bet higher', async () => {
    const account = await createAccount(toSol(10));

    const transaction = await createBetTransaction(program, account.publicKey, toSol(7));
    await provider.sendAndConfirm(transaction, [account]);

    const betState = await program.account.betState.fetch(betStatePublicKey)
    expect(betState.lastBetAccount).toEqual(account.publicKey);
    expect(Number(betState.lastBetValue)).toEqual(toSol(7));
    expect(Number(betState.prizepool)).toEqual(toSol(12));

    const currentSlot = await provider.connection.getSlot();
    expect(Number(betState.winAtSlot)).toEqual(currentSlot + slot_to_win);
  });

  let winning_account: Keypair;
  it('Takes a 1% fee additional to the bet amount and send it to creator address', async () => {
    const account = await createAccount(toSol(10));
    winning_account = account;

    const creatorBalanceBefore = await provider.connection.getBalance(new PublicKey("H2tRSUTkwqXm5Uba6GRqrvPwH5m4ziyBMQYMkNEiqf3H"));

    const transaction = await createBetTransaction(program, account.publicKey, toSol(8));
    await provider.sendAndConfirm(transaction, [account]);

    expect(await provider.connection.getBalance(account.publicKey)).toEqual(toSol(1.92)); // 10 - 8 - 0.08
    expect(await provider.connection.getBalance(new PublicKey("H2tRSUTkwqXm5Uba6GRqrvPwH5m4ziyBMQYMkNEiqf3H"))).toEqual(toSol(0.08) + creatorBalanceBefore);
  });

  it('Fail if deposit do not include fee', async () => {
    const account = await createAccount(toSol(100));

    // 0.4 fee is lower than the 0.5 fee expected
    const transaction = await createBetTransaction(program, account.publicKey, toSol(50), /*deposit_amount=*/toSol(50.4));
    try {
      await provider.sendAndConfirm(transaction, [account]);
      fail("The bet should fail");
    } catch (_err) {
      expect(_err).toBeInstanceOf(anchor.web3.SendTransactionError);
      const err = _err as anchor.web3.SendTransactionError;
      expect(err.message).toContain("InsufficientFundsForTransaction");
    }
  });

  it('Can not withdraw if not last bidder', async () => {
    const account = await createAccount(toSol(100));

    try {
      await program.methods.withdraw()
        .accounts({
          winner: account.publicKey
        })
        .signers([account])
        .rpc();
    } catch (_err) {
      expect(_err).toBeInstanceOf(anchor.AnchorError);
      const err = _err as anchor.AnchorError;
      expect(err.message).toContain("ConstraintRaw");
    }
  });

  it('Can not withdraw early', async () => {
    try {
      await program.methods.withdraw()
        .accounts({
          winner: winning_account.publicKey
        })
        .signers([winning_account])
        .rpc();
    } catch (_err) {
      expect(_err).toBeInstanceOf(anchor.AnchorError);
      const err = _err as anchor.AnchorError;
      expect(err.message).toContain("TimeRemaining");
    }
  });
})

const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey(
  '11111111111111111111111111111111',
);

// Bankrun tests are less fidel but they allow manipulatin the clock and so test
// the withdraw mechanism.
describe('Bankrun tests - withdraw', () => {
  let provider: BankrunProvider
  let program: Program<Bet>;
  const payer = Keypair.generate();
  const winningBidder = Keypair.generate();
  let betStatePublicKey: anchor.web3.PublicKey;

  beforeAll(async () => {
    const context = await startAnchor(".", [], [
      {
        address: payer.publicKey,
        info: {
          lamports: toSol(10),
          data: Buffer.alloc(0),
          owner: SYSTEM_PROGRAM_ID,
          executable: false,
        },
      },
      {
        address: winningBidder.publicKey,
        info: {
          lamports: toSol(10),
          data: Buffer.alloc(0),
          owner: SYSTEM_PROGRAM_ID,
          executable: false,
        },
      }
    ]);
    provider = new BankrunProvider(context);
    anchor.setProvider(provider);
    program = new Program<Bet>(IDL, provider);
    betStatePublicKey = getBetStatePublicKey(program);
  });

  it('Initialize the program', async () => {
    try {
      await program.methods
        .setup()
        .accounts({
          payer: payer.publicKey,
        })
        .signers([payer])
        .rpc()
    } catch (e) {
      console.error(e);
      fail(e);
    }
  });

  it('Can bet', async () => {
    await provider.sendAndConfirm?.(await createBetTransaction(program, payer.publicKey, toSol(5)), [payer]);
    await provider.sendAndConfirm?.(await createBetTransaction(program, winningBidder.publicKey, toSol(7)), [winningBidder]);
  });

  it('Can withdraw', async () => {
    const currentClock = await provider.context.banksClient.getClock();
    await provider.context.setClock(new Clock(
      currentClock.slot + BigInt(slot_to_win + 10),
      currentClock.epochStartTimestamp,
      currentClock.epoch,
      currentClock.leaderScheduleEpoch,
      currentClock.unixTimestamp
    ));

    await program.methods.withdraw()
      .accounts({
        winner: winningBidder.publicKey
      })
      .signers([winningBidder])
      .rpc();

    const winnerBalance = await provider.context.banksClient.getBalance(winningBidder.publicKey);
    // Original balance 10 - Bet 7 - Fee 0.07 + Prizepool 12 = 14.993
    expect(Number(winnerBalance)).toEqual(toSol(14.93));

    const betState = await program.account.betState.fetch(betStatePublicKey);
    expect(Number(betState.lastBetValue)).toEqual(0);
    expect(Number(betState.winAtSlot)).toEqual(0);
    expect(Number(betState.prizepool)).toEqual(0);
    expect(betState.lastBetAccount).toEqual(anchor.web3.PublicKey.default);
  });

  it('Can bet again after withdraw', async () => {
    await provider.sendAndConfirm?.(await createBetTransaction(program, payer.publicKey, toSol(1)), [payer]);

    const betState = await program.account.betState.fetch(betStatePublicKey);
    expect(betState.lastBetAccount).toEqual(payer.publicKey);
    expect(Number(betState.lastBetValue)).toEqual(toSol(1));
    expect(Number(betState.prizepool)).toEqual(toSol(1));
  });
})