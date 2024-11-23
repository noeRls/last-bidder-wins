import { configureStore } from "@reduxjs/toolkit";
import { slotSlice  } from "./slot";
import { useDispatch, useSelector, useStore } from 'react-redux'

export const store = configureStore({ reducer: { slot: slotSlice.reducer } });

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
