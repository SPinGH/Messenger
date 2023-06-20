import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/api',
    prepareHeaders: (headers, api) => {
        const state = api.getState() as RootState;

        if (state.token.accessToken) {
            headers.set('Authorization', `Bearer ${state.token.accessToken}`);
        }

        return headers;
    },
});

export const commonApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQuery,
    endpoints: () => ({}),
});
