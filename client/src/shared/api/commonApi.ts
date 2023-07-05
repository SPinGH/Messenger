import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearToken } from '.';

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

const baseQueryWithClearToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) api.dispatch(clearToken());

    return result;
};

export const commonApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithClearToken,
    endpoints: () => ({}),
});
