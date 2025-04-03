import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import noteReducer from './features/noteSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notes: noteReducer,
    },
});