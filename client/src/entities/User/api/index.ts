import { Token, commonApi } from '@/shared/api';

import { Auth, User } from '../model';

export const userApi = commonApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query<User | null, void>({
            queryFn: async (arg, api, extraOptions, baseQuery) => {
                const state = api.getState() as RootState;

                if (!state.token.accessToken) return { data: null };

                const result = await baseQuery('/user');
                if (result.error) return { error: result.error };

                return { data: result.data as User };
            },
        }),

        signIn: builder.mutation<Token, Auth>({
            query: (data) => ({
                url: '/login',
                method: 'POST',
                body: data,
            }),
        }),

        signUp: builder.mutation<Token, Auth>({
            query: (data) => ({
                url: '/signup',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});
