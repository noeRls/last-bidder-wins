import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const slotSlice = createSlice({
  name: 'slot',
  initialState: { currentSlot: 0 },
  reducers: {
    setCurrentSlot: (state, action: PayloadAction<number>) => {
      state.currentSlot = action.payload;
    },
  },
});
