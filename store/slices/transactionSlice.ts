import { createSlice, type PayloadAction, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import type { Transaction, TransactionState, FilterOptions, SummaryStats } from '../../types';
import { TransactionType } from '../../types';
import {
    calculateTotalIncome,
    calculateTotalExpenses,
    calculateBalance,
    getCategoryBreakdown,
    getMonthlyData,
} from '../../utils/calculations';
import { api } from '../../services/api';

const initialState: TransactionState = {
    transactions: [],
    filters: {},
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async (userId: string) => {
    const response = await api.getTransactions(userId);
    return response;
});

export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (initialTransaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        const response = await api.addTransaction(initialTransaction);
        return response;
    }
);

export const updateTransaction = createAsyncThunk(
    'transactions/updateTransaction',
    async (transaction: Transaction) => {
        const response = await api.updateTransaction(transaction);
        return response;
    }
);

export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (id: string) => {
        await api.deleteTransaction(id);
        return id;
    }
);

const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<FilterOptions>) => {
            state.filters = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {};
        },
        clearAllTransactions: (state) => {
            state.transactions = [];
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch transactions';
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.transactions.push(action.payload);
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.transactions.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.transactions[index] = action.payload;
                }
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter((t) => t.id !== action.payload);
            })
            .addMatcher(
                (action) => action.type === 'auth/logout/fulfilled',
                (state) => {
                    state.transactions = [];
                    state.status = 'idle';
                }
            );
    },
});

export const {
    setFilters,
    clearFilters,
    clearAllTransactions,
} = transactionSlice.actions;

// Selectors
export const selectAllTransactions = (state: { transactions: TransactionState }) =>
    state.transactions.transactions;

export const selectTransactionsStatus = (state: { transactions: TransactionState }) =>
    state.transactions.status;

export const selectTransactionsError = (state: { transactions: TransactionState }) =>
    state.transactions.error;

export const selectFilters = (state: { transactions: TransactionState }) => state.transactions.filters;

export const selectFilteredTransactions = createSelector(
    [selectAllTransactions, selectFilters],
    (transactions, filters) => {
        let filtered = [...transactions];

        if (filters.type) {
            filtered = filtered.filter((t) => t.type === filters.type);
        }

        if (filters.category) {
            filtered = filtered.filter((t) => t.category === filters.category);
        }

        if (filters.startDate) {
            filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.startDate!));
        }

        if (filters.endDate) {
            filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.endDate!));
        }

        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (t) =>
                    t.description.toLowerCase().includes(searchLower) ||
                    t.category.toLowerCase().includes(searchLower) ||
                    new Date(t.date).toLocaleString().toLowerCase().includes(searchLower)
            );
        }

        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
);

export const selectSummaryStats = createSelector([selectFilteredTransactions], (transactions): SummaryStats => {
    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    const balance = calculateBalance(transactions);
    const incomeCategoryBreakdown = getCategoryBreakdown(transactions, TransactionType.INCOME);
    const expenseCategoryBreakdown = getCategoryBreakdown(transactions, TransactionType.EXPENSE);
    const monthlyData = getMonthlyData(transactions);

    return {
        totalIncome,
        totalExpenses,
        balance,
        transactionCount: transactions.length,
        incomeCategoryBreakdown,
        expenseCategoryBreakdown,
        monthlyData,
    };
});

export const selectRecentTransactions = createSelector([selectFilteredTransactions], (transactions) =>
    transactions.slice(0, 10)
);

export const selectTransactionsByType = createSelector(
    [selectAllTransactions, (_state: any, type: TransactionType) => type],
    (transactions, type) => transactions.filter((t) => t.type === type)
);

export default transactionSlice.reducer;
