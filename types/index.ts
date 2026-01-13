export const TransactionType = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE',
} as const;

export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
    date: string;
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    type: TransactionType;
    icon?: string;
    color?: string;
}

export interface FilterOptions {
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
}

export interface SummaryStats {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
    incomeCategoryBreakdown: CategoryBreakdown[];
    expenseCategoryBreakdown: CategoryBreakdown[];
    monthlyData: MonthlyData[];
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
    count: number;
}

export interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
    balance: number;
}

export interface TransactionState {
    transactions: Transaction[];
    filters: FilterOptions;
    status?: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

export interface CategoryState {
    categories: Category[];
    status?: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;
}

export interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
    token: string | null;
    isLoading: boolean;
    isError: boolean;
    message: string;
}

export interface RootState {
    transactions: TransactionState;
    categories: CategoryState;
    auth: AuthState;
}
