import { createSelector } from '@reduxjs/toolkit'
import { RootState, useAppDispatch } from "./store";
import { useCluster } from '@/components/cluster/cluster-data-access';
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { useEffect } from 'react';
import { slotSlice } from './slot';

export const selectCurrentSlot = (state: RootState) => {
  return state.slot.currentSlot;
};

export const selectCurrentSlotIsLoaded = createSelector(selectCurrentSlot, slot => {
  return slot > 0;
});

export function useRefreshSlot() {
  const dispatch = useAppDispatch();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();

  useEffect(() => {
    const subId = provider.connection.onSlotChange((slot) => dispatch(slotSlice.actions.setCurrentSlot(slot.slot)));
    return () => { provider.connection.removeSlotUpdateListener(subId).catch(console.error) };
  }, [dispatch, cluster]); // eslint-disable-line react-hooks/exhaustive-deps
}
