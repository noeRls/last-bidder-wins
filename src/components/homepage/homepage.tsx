import { Link } from 'react-router-dom'
import { useBetState, useWithdraw } from '../bet/bet-data';
import { useCanWithdraw } from './homepage-data';
import { FormatLamports } from '../solana/sol-display';
import { LoadingSpinnerOrError } from '../ui/spinner';
import { PublicKey } from '@solana/web3.js';
import { TARGETED_TIME_TO_WIN_MS } from '@project/anchor';
import { useAppSelector } from '@/redux/store';
import { selectCurrentSlot, selectCurrentSlotIsLoaded } from '@/redux/slot-hooks';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { TosModal } from '../tos/tos-modal';

function HowItWorks() {
  return (
    <div className="card w-full max-w-md bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">🎯 How It Works</h2>
        <ul className="list-none space-y-4 text-gray-700">
          <li>
            ✅ <strong>Step 1:</strong> Place a bet higher than the current highest bet to enter the game.
          </li>
          <li>
            ⏳ <strong>Step 2:</strong> If no one beats your bet within 24 hours, you become eligible to withdraw the prize pool!
          </li>
          <li>
            💸 <strong>Step 3:</strong> Withdraw the prize to claim your winnings. Act fast—other players can still bet higher until you withdraw!
          </li>
          <li>
            ⚠️ <strong>Note:</strong> If someone places a higher bet before you withdraw, they become eligible for the prize pool instead.
          </li>
        </ul>
      </div>
    </div>
  );
}

function LastBet({ lastBetValue, lastBetAccount }: { lastBetValue: number, lastBetAccount: PublicKey }) {
  return (<div className="card w-full max-w-md bg-base-200 shadow-lg">
    <div className="card-body text-center">
      <h2 className="card-title justify-center text-2xl">🏆 Leading Bet - Potential Winner</h2>
      <p className="text-lg">
        <span className="font-bold">{FormatLamports(lastBetValue)}</span> by{" "}
        <ExplorerLink path={`account/${lastBetAccount.toString()}`} label={ellipsify(lastBetAccount.toString())} />
      </p>
    </div>
  </div>)
}

const formatTime = (secs: number): string => {
  const pad = (n: number) => n < 10 ? `0${n}` : n;

  const h = Math.floor(secs / 3600);
  const m = Math.ceil(secs / 60) - (h * 60);
  // const s = Math.floor(secs - h * 3600 - m * 60);

  return `${pad(h)}h${pad(m)}m`;
}

function Countdown({ winAtSlot }: { winAtSlot: number }) {
  const currentSlot = useAppSelector(selectCurrentSlot);
  const MS_PER_SLOT = 400;
  const slotsRemaining = winAtSlot - currentSlot;
  let timeRemainingMs = slotsRemaining * MS_PER_SLOT;

  const noBetPlaced = winAtSlot == 0;
  if (noBetPlaced) {
    timeRemainingMs = TARGETED_TIME_TO_WIN_MS;
  }

  const countdownFinished = slotsRemaining <= 0 && !noBetPlaced;

  return (
    <div className="card w-full max-w-md bg-base-200 shadow-lg">
      <div className="card-body text-center flex flex-col items-center">
        <h2 className="card-title justify-center text-2xl">⏳ Time to Win</h2>
        {countdownFinished ? (
          <>
            <p className="text-lg font-bold">
              Withdraw Now!
            </p>
            <p className="text-sm text-muted mt-2">
              The countdown is over! If you're the last bettor, claim your prize before someone bets higher!
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold">~{formatTime(timeRemainingMs / 1000)}</p>
            <p className="text-sm text-muted">
              Time is an estimate derived from Solana slot speed (~{MS_PER_SLOT}ms per slot). {slotsRemaining > 0 && <span>
                <strong>{slotsRemaining} slots</strong> remaining.</span>}
            </p>
          </>
        )}


        <p className="text-sm text-muted">
          The timer resets to 24h whenever a new bet is placed.
        </p>
      </div>
    </div>
  );
}

function PrizePool({ prizepool }: { prizepool: number }) {
  return (
    <div className="card bg-gradient-to-r from-purple-600 to-green-400 shadow-xl text-white w-full">
      <div className="card-body text-center">
        <h2 className="card-title justify-center text-3xl font-bold uppercase tracking-wider">💰 Prize Pool</h2>
        <p className="text-7xl font-extrabold mt-4">{FormatLamports(prizepool)}</p>
        <p className="text-lg mt-2">Get ready to take it all!</p>
      </div>
    </div>
  );
}

function WithdrawButton() {
  const { publicKey } = useWallet();

  const canWithdrawWithReason = useCanWithdraw();
  const canWithdraw = canWithdrawWithReason.result;
  let reason = canWithdrawWithReason.reason;

  const withdraw = useWithdraw();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  let disabled = !canWithdraw;
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    if (!publicKey) {
      setWalletModalVisible(true);
    } else {
      setShowModal(true);
    }
  };

  const onAgree = () => {
    setShowModal(false);
    withdraw.mutateAsync();
  }

  if (withdraw.isPending) {
    disabled = true;
    reason = "Transaction in progress, follow wallet instructions";
  }

  return (<div>
    <div className="tooltip tooltip-top" data-tip={disabled ? reason : null}>
      <button className="btn btn-accent btn-wide text-lg" disabled={disabled} onClick={onClick}>
        {withdraw.isPending ? "Processing..." : "Withdraw Prize"}
      </button>
    </div>{showModal && <TosModal subtitle=" By proceeding with the withdrawal, you acknowledge and agree that" onAgree={onAgree} onCancel={() => setShowModal(false)} additionalSections={[{
      bold: "Finality of Transaction",
      content: "Withdrawals are processed autonomously by blockchain smart contracts. Once initiated, they are final and cannot be reversed."
    }]} />}</div>)
}


export default function HomePage() {
  const betState = useBetState();
  const currentSlotLoaded = useAppSelector(selectCurrentSlotIsLoaded);

  return betState.isSuccess && currentSlotLoaded ? (
    <div className="flex flex-col items-center justify-center h-auto">
      <div className="grid lg:grid-cols-2 grid-cols-1 grid-rows-[auto_minmax(0,_auto)_minmax(0,_1fr)] gap-6">
        <div className="col-span-1 lg:col-span-2  w-full flex items-center">
          <PrizePool prizepool={betState.data.prizepool} />
        </div>
        <div>
          <Countdown winAtSlot={betState.data.winAtSlot} />
        </div>
        {betState.data.lastBetValue > 0 &&
          <div className="col-span-1 lg:order-1">
            <LastBet lastBetAccount={betState.data.lastBetAccount} lastBetValue={betState.data.lastBetValue} />
          </div>
        }
        <div className="lg:row-span-2">
          <HowItWorks />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-row gap-4 flex-wrap items-center justify-center mt-6">
        <Link to="/bet" className="btn btn-accent btn-wide text-lg">
          Place Bet
        </Link>
        <WithdrawButton />
      </div>
    </div>
  ) : <LoadingSpinnerOrError queries={[betState]} />
}
