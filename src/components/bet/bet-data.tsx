import { getBetProgram, getBetProgramId, getBetStatePublicKey, createBetTransaction } from '@project/anchor'
import { Cluster, ComputeBudgetProgram, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { useNavigate } from 'react-router'
import { useConnection } from '@solana/wallet-adapter-react'
import { web3 } from '@coral-xyz/anchor'

export function useLastBidderProgram() {
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getBetProgramId(cluster.network as Cluster), [cluster])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const program = useMemo(() => getBetProgram(provider), [cluster]);

  return {
    program,
    programId,
  }
}

export function useBetState() {
  const { program } = useLastBidderProgram();
  const { connection } = useConnection();
  const betStateAccount = useMemo(() => getBetStatePublicKey(program), [program]);

  return useQuery({
    queryKey: ['betstate', { betStateAccount, endpoint: connection.rpcEndpoint }],
    queryFn: () => program.account.betState.fetch(betStateAccount),
  });
}

export function useSetupBetState() {
  const { program } = useLastBidderProgram();
  const betState = useBetState();
  const transactionToast = useTransactionToast();

  return useMutation({
    mutationFn: () => program.methods.setup().rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return betState.refetch();
    },
    onError: (err) => {
      console.error(err);
      toast.error(`Transaction failed! ${err}`);
    }
  });
}

const SLEEP_BEFORE_BET_STATE_REFETCH_MS = 500;
const FEE_MICRO_LAMPORTS = 1_000_000;

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function usePlaceBet(account: PublicKey) {
  const betState = useBetState();
  const { program } = useLastBidderProgram();
  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast()
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (lamports: number) => {
      const transaction = new web3.Transaction();
      transaction.add(ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: FEE_MICRO_LAMPORTS
      }));
      transaction.add(await createBetTransaction(program, account, lamports));
      return provider.sendAndConfirm(transaction);
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      navigate("/home");
      sleep(SLEEP_BEFORE_BET_STATE_REFETCH_MS).then(() => {
        betState.refetch();
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(`Transaction failed! ${err}`);
    }
  });
}

export function useWithdraw() {
  const { program } = useLastBidderProgram();
  const betState = useBetState();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  return useMutation({
    mutationFn: async () => {
      const transaction = new web3.Transaction();
      transaction.add(ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: FEE_MICRO_LAMPORTS
      }));
      transaction.add(await program.methods.withdraw().transaction());
      return provider.sendAndConfirm(transaction);
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      sleep(SLEEP_BEFORE_BET_STATE_REFETCH_MS).then(() => {
        betState.refetch();
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error(`Transaction failed! ${err}`);
    }
  });
}
