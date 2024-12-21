import { getBetProgram, getBetProgramId, getBetStatePublicKey, createBetTransaction } from '@project/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { useNavigate } from 'react-router'
import { useConnection } from '@solana/wallet-adapter-react'

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

export function usePlaceBet(account: PublicKey) {
  const betState = useBetState();
  const { program } = useLastBidderProgram();
  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast()
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (lamports: number) => {
      const transaction = await createBetTransaction(program, account, lamports);
      return provider.sendAndConfirm(transaction);
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      navigate("/home");
      return betState.refetch();
    },
    onError: (err) => {
      console.error(err);
      toast.error(`Transaction failed! ${err}`);
    }
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

export function useWithdraw() {
  const { program } = useLastBidderProgram();
  const betState = useBetState();
  const transactionToast = useTransactionToast();

  return useMutation({
    mutationFn: () => program.methods.withdraw().rpc(),
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
