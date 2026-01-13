import { type Transaction, TransactionType } from '../types';

export const calculateTotalIncome = (transactions: Transaction[]): number => {
    return transactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
    return transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
    return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const getCategoryBreakdown = (transactions: Transaction[], type: TransactionType) => {
    const filtered = transactions.filter((t) => t.type === type);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);

    const breakdown = filtered.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = { amount: 0, count: 0 };
        }
        acc[category].amount += transaction.amount;
        acc[category].count += 1;
        return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    return Object.entries(breakdown).map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
        count: data.count,
    }));
};

export const getMonthlyData = (transactions: Transaction[]) => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyMap.has(monthKey)) {
            monthlyMap.set(monthKey, { income: 0, expenses: 0 });
        }

        const monthData = monthlyMap.get(monthKey)!;
        if (transaction.type === TransactionType.INCOME) {
            monthData.income += transaction.amount;
        } else {
            monthData.expenses += transaction.amount;
        }
    });

    return Array.from(monthlyMap.entries())
        .map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            balance: data.income - data.expenses,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
};

export const filterTransactionsByDateRange = (
    transactions: Transaction[],
    startDate?: string,
    endDate?: string
): Transaction[] => {
    if (!startDate && !endDate) return transactions;

    return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();

        return transactionDate >= start && transactionDate <= end;
    });
};
