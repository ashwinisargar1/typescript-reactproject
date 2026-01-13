import axios from 'axios';
import { type Transaction, type Category } from '../types';

const API_URL = 'http://localhost:5000';

export const api = {
    // Transactions
    getTransactions: async (userId: string): Promise<Transaction[]> => {
        const response = await axios.get(`${API_URL}/transactions?userId=${userId}`);
        return response.data;
    },

    addTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
        const newTransaction = {
            ...transaction,
            createdAt: new Date().toISOString()
        };
        const response = await axios.post(`${API_URL}/transactions`, newTransaction);
        return response.data;
    },

    updateTransaction: async (transaction: Transaction): Promise<Transaction> => {
        const response = await axios.put(`${API_URL}/transactions/${transaction.id}`, transaction);
        return response.data;
    },

    deleteTransaction: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/transactions/${id}`);
    },

    // Categories
    getCategories: async (): Promise<Category[]> => {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    },

    addCategory: async (category: Omit<Category, 'id'>): Promise<Category> => {
        const response = await axios.post(`${API_URL}/categories`, category);
        return response.data;
    },

    deleteCategory: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/categories/${id}`);
    },
};
