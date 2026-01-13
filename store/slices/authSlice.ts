import axios from 'axios';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const user = JSON.parse(localStorage.getItem('user') || 'null');
const token = localStorage.getItem('token');

const initialState: AuthState = {
    user: user,
    token: token,
    isLoading: false,
    isError: false,
    message: ''
};

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/users?email=${userData.email}`);
            const existingUsers = response.data;

            // Check if user exists
            if (existingUsers.length > 0) {
                return thunkAPI.rejectWithValue('User already exists');
            }

            const newUser = {
                name: userData.name,
                email: userData.email,
                password: userData.password // In a real app, this would be hashed
            };

            await axios.post(`${API_URL}/users`, newUser);

            return { success: true };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/users?email=${userData.email}&password=${userData.password}`);
            const users = response.data;

            // Find user
            const user = users[0];

            if (!user) {
                return thunkAPI.rejectWithValue('Invalid email or password');
            }

            // Remove password before storing in state/localStorage
            const { password, ...userWithoutPassword } = user;
            const mockToken = 'mock-jwt-token-' + user.id;

            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            localStorage.setItem('token', mockToken);

            return { user: userWithoutPassword, token: mockToken };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                // Don't set user/token here to force manual login after registration
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload as string;
                state.user = null;
                state.token = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
