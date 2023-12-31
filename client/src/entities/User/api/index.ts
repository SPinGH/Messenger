import { TokenStorage, commonApi } from '@/shared/api';

import { Auth, ChangePassword, Token, User, UserInfo } from '../model';

export const userApi = commonApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserInfo: builder.query<UserInfo | null, void>({
            queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
                if (!TokenStorage.get()) return { data: null };

                const result = await baseQuery('/user');
                if (result.error) return { error: result.error };

                return { data: result.data as UserInfo };
            },
        }),

        getUser: builder.query<User, string>({
            query: (id) => ({ url: `/user/${id}` }),
        }),

        getUsers: builder.query<User[], Pick<User, 'username'>>({
            query: (params) => ({ url: '/user/all', params }),
        }),

        signIn: builder.mutation<Token, Auth>({
            query: (data) => ({
                url: '/user/signin',
                method: 'POST',
                body: data,
            }),
        }),

        signUp: builder.mutation<Token, Auth>({
            query: (data) => ({
                url: '/user/signup',
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
                            if (user) user.user.username = arg.username;
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
