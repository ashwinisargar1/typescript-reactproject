import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import transactionReducer from './slices/transactionSlice';
import categoryReducer from './slices/categorySlice';
import authReducer from './slices/authSlice';
import { type RootState } from '../types';

export const store = configureStore({
    reducer: {
        transactions: transactionReducer,
        categories: categoryReducer,
        auth: authReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
