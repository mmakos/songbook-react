import { configureStore } from '@reduxjs/toolkit';
import songbookReducer, { ISongbookState } from './songbook.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: songbookReducer,
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<ISongbookState>();

export default store;
