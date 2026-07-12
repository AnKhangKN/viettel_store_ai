import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, user } = action.payload;
            if (accessToken !== undefined) state.accessToken = accessToken;
            if (user !== undefined) state.user = user;
        },
        clearCredentials: (state) => {
            state.accessToken = null;
            state.user = null;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
