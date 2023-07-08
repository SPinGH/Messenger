import { configureStore } from '@reduxjs/toolkit';

import { commonApi } from '@/shared/api';

export const createStore = () =>
    configureStore({
        reducer: {
            [commonApi.reducerPath]: commonApi.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(commonApi.middleware),
    });
