import { useState } from "react";
import { FormatSol, LamportsToSol, RoundSol, SolToLamports } from "../solana/sol-display";
import { useBetState, usePlaceBet } from "./bet-data";
import { LoadingSpinnerOrError } from "../ui/spinner";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@coral-xyz/anchor";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { TosModal } from "../tos/tos-modal";
import { BET_FEE_RATIO } from "@project/anchor";

function PlaceBetButton({ solBet, lastBetSol }: { solBet: number, lastBetSol: number }) {
  const wallet = useWallet();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const placeBet = usePlaceBet(wallet.publicKey || web3.PublicKey.default);
  const [showModal, setShowModal] = useState(false);

  const onPlaceBetClick = () => {
    if (wallet.publicKey) {
      setShowModal(true);
    } else {
      setWalletModalVisible(true);
    }
  };

  const handleAgree = () => {
    setShowModal(false);
    placeBet.mutateAsync(SolToLamports(solBet));
  };

  const tooSmallBet = lastBetSol >= solBet || solBet <= 0;
  const isDisabled = placeBet.isPending || tooSmallBet;

  let tooltipText = undefined;
  if (placeBet.isPending) {
    tooltipText = "Transaction in progress, follow wallet instructions"
  }
  if (tooSmallBet) {
    tooltipText = "You need to place a higher bet";
  }

  return (
    <div>
      <div className="tooltip tooltip-top" data-tip={tooltipText}>
        <button className="btn btn-loading btn-accent btn-wide text-lg font-bold" onClick={onPlaceBetClick} disabled={isDisabled}>
          {placeBet.isPending ? "Processing..." : "Place Bet"}
        </button>
      </div>
      {showModal && <TosModal subtitle="By placing a bet, you explicitly acknowledge and agree to the following" onAgree={handleAgree} onCancel={() => setShowModal(false)}
        additionalSections={[{
          bold: "Irreversible Transactions",
          content: "All bets are final and non-refundable. Once submitted, your SOL cannot be returned under any circumstances."
        }, {
          bold: "Higher Bets",
          content: "If someone places a higher bet within 24 hours, you will lose your eligibility to win and your bet will remain in the prize pool."
        }]}
      />
      }
    </div>
  )
}

function BetPage({ prizepoolLamports, lastBetLamports }: { prizepoolLamports: number, lastBetLamports: number }) {
  const lastBetSol = LamportsToSol(lastBetLamports);
  const [betAmount, setBetAmount] = useState(lastBetSol ? RoundSol(lastBetSol * 2) : 0); // User input for bet amount
  const networkFeeEstimate = 0.0004; // Example network fee in SOL

  // Calculations
  const prizepoolSol = LamportsToSol(prizepoolLamports);
  const projectFee =  betAmount * BET_FEE_RATIO;
  const totalFees = projectFee + networkFeeEstimate;
  const totalCost = betAmount + totalFees;
  const potentialGain = prizepoolSol + betAmount;

  const isValidBet = betAmount > lastBetSol; // Minimum bet must be > last bet

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-md">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-center">Place Your Bet</h1>

        {/* Input for Bet Amount */}
        <div className="form-control w-full  mb-4">
          <label className="label">
            <span className="label-text">Enter Amount (SOL)</span>
          </label>
          <input
            type="number"
            placeholder={`Enter more than ${FormatSol(lastBetSol)}`}
            className={`input input-bordered w-full ${!isValidBet && betAmount != 0 ? "input-error" : ""
              }`}
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
          />
          {!isValidBet && betAmount != 0 && (
            <span className="text-sm text-error mt-2">
              Your bet must be greater than {FormatSol(lastBetSol)}.
            </span>
          )}
        </div>

        {lastBetSol ?
          <div className="w-full  text-left mb-6">
            <p className="text-sm text-gray-600">
              <strong>Minimum bet required:</strong> <span>{FormatSol(lastBetSol + 0.0001)}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              The minimum bet reflects the last bet placed to ensure only higher bets can claim the jackpot.
            </p>
          </div>
          : <div />}

        {/* Breakdown Section */}
        <div className="w-full  text-left mb-6">
          <h2 className="text-xl font-bold mb-4">Cost Breakdown</h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span>💰 Prize Pool Contribution</span>
              <span>{FormatSol(betAmount)}</span>
            </li>
            <li className="flex justify-between">
              <span>🛠 Project Fee (1%)</span>
              <span>{FormatSol(projectFee)}</span>
            </li>
            <li className="flex justify-between">
              <span>🌐 Network Fee Estimate</span>
              <span>{FormatSol(networkFeeEstimate)}</span>
            </li>
            <li className="flex justify-between font-bold">
              <span>Total Cost</span>
              <span>~{FormatSol(totalCost)}</span>
            </li>
          </ul>
        </div>

        {/* Potential Gain Section */}
        <div className="w-full  text-left mb-6">
          <h2 className="text-xl font-bold mb-4">Potential Reward</h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span>🎯 Refund of Your Bet</span>
              <span>{FormatSol(betAmount)}</span>
            </li>
            <li className="flex justify-between">
              <span>🏆 Prize Pool Winnings</span>
              <span>{FormatSol(prizepoolSol)}</span>
            </li>
            <li className="flex justify-between font-bold text-green-500">
              <span>Final Payout</span>
              <span>{FormatSol(potentialGain)}</span>
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            ✨ If no one bets higher within 24h, the prize is all yours! But remember, if someone bets higher, you'll lose your chance and your bet.
          </p>
        </div>

        {/* Bet Button */}
        <PlaceBetButton solBet={betAmount} lastBetSol={lastBetSol} />
      </div>
    </div>
  );
}

export default function BetPageWithLoading() {
  const betState = useBetState();

  return betState.isSuccess ?
    <BetPage lastBetLamports={betState.data.lastBetValue} prizepoolLamports={betState.data.prizepool} /> :
    <LoadingSpinnerOrError queries={[betState]} />
}