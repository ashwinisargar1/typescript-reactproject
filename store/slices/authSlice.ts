
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




const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null') ||
    JSON.parse(localStorage.getItem('user') || 'null');

const storedToken = sessionStorage.getItem('token') ||
    localStorage.getItem('token');


const initialState: AuthState = {
    user: storedUser,
    token: storedToken,
    isLoading: false,
    isError: false,
    message: ''
};



export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.get(
                `${API_URL}/users?email=${userData.email}`
            );

            if (response.data.length > 0) {
                return thunkAPI.rejectWithValue('User already exists');
            }

            const newUser = {
                name: userData.name,
                email: userData.email,
                password: userData.password
            };

            await axios.post(`${API_URL}/users`, newUser);
            return { success: true };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const login = createAsyncThunk(
    'auth/login',
    async (userData: any, thunkAPI) => {
        try {
            const response = await axios.get(
                `${API_URL}/users?email=${userData.email}&password=${userData.password}`
            );

            const user = response.data[0];

            if (!user) {
                return thunkAPI.rejectWithValue('Invalid email or password');
            }

            const { password, ...userWithoutPassword } = user;
            const mockToken = `mock-jwt-token-${user.id}`;

            
            sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
            sessionStorage.setItem('token', mockToken);

            return { user: userWithoutPassword, token: mockToken };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
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
