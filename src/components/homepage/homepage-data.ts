import { useBetState } from "../bet/bet-data";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAppSelector } from "@/redux/store";
import { selectCurrentSlot } from "@/redux/slot-hooks";

interface CanWithdrawResult {
  result: boolean;
  reason?: string;
}

export function useCanWithdraw(): CanWithdrawResult {
  const currentSlot = useAppSelector(selectCurrentSlot);
  const betState = useBetState();
  const { publicKey } = useWallet();

  if (!currentSlot || !betState.isSuccess) {
    return { result: false, reason: "Internal error, failed to load state" };
  }
  if (betState.data.winAtSlot == 0) {
    return { result: false, reason: "No bet placed yet" }
  }
  if (betState.data.winAtSlot > currentSlot) {
    return { result: false, reason: "You cannot withdraw yet. Timer is still running." };
  }
  if (publicKey && !betState.data.lastBetAccount.equals(publicKey)) {
    return { result: false, reason: "You are not the winner" };
  }
  return {
    result: true,
    reason: undefined
  };
}
