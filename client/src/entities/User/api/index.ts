import { commonApi } from '@/shared/api';

import { User } from '../model';

export const candidateApi = commonApi.injectEndpoints({
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
    }),
});
