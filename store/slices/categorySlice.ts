import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Category, CategoryState } from '../../types';
import { TransactionType } from '../../types';
import { api } from '../../services/api';

const initialState: CategoryState = {
    categories: [],
    status: 'idle',
    error: null,
};

// Async Thunks
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await api.getCategories();
    return response;
});

export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (category: Omit<Category, 'id'>) => {
        const response = await api.addCategory(category);
        return response;
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id: string) => {
        await api.deleteCategory(id);
        return id;
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch categories';
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((cat) => cat.id !== action.payload);
            });
    },
});

export const { } = categorySlice.actions;

// Selectors
export const selectAllCategories = (state: { categories: CategoryState }) => state.categories.categories;

export const selectCategoriesStatus = (state: { categories: CategoryState }) => state.categories.status;

export const selectCategoriesByType = (state: { categories: CategoryState }, type: TransactionType) =>
    state.categories.categories.filter((cat) => cat.type === type);

export const selectCategoryById = (state: { categories: CategoryState }, id: string) =>
    state.categories.categories.find((cat) => cat.id === id);

export default categorySlice.reducer;
