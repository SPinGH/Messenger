import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TokenStorage } from './token';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/api',
    prepareHeaders: (headers) => {
        const token = TokenStorage.get();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryWithClearToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        TokenStorage.clear();
    }

    return result;
};

export const commonApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithClearToken,
    endpoints: () => ({}),
});
