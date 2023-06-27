import { Token, commonApi } from '@/shared/api';

import { Auth, ChangePassword, User } from '../model';

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

        getUser: builder.query<User, string>({
            query: (id) => ({ url: `/user/${id}` }),
        }),

        getUsers: builder.query<User[], Pick<User, 'username'>>({
            query: (params) => ({ url: '/users', params }),
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

        updateUser: builder.mutation<void, Pick<User, 'username'>>({
            query: (data) => ({
                url: '/user',
                method: 'PUT',
                body: data,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;

                    dispatch(
                        userApi.util.updateQueryData('getUserInfo', undefined, (user) => {
                            if (user) user.username = arg.username;
                        })
                    );
                } catch (e) {}
            },
        }),

        changePassword: builder.mutation<void, ChangePassword>({
            query: (data) => ({
                url: '/user/password',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
});
