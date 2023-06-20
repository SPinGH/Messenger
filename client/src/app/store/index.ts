import { configureStore } from '@reduxjs/toolkit';

import { commonApi, TokenSlice } from '@/shared/api';

export const createStore = () =>
    configureStore({
        reducer: {
            token: TokenSlice,
            [commonApi.reducerPath]: commonApi.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(commonApi.middleware),
    });
