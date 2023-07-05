import { commonApi } from '@/shared/api';
import { Group, GroupRequest, Message, MessageRequest } from '..';
import { parseSocketMessage, socketMessage } from '../lib/socketMessage';
import { userApi } from '@/entities/User';

let socket: WebSocket;

const getSocket = () => {
    if (!socket) {
        socket = new WebSocket(`${import.meta.env.VITE_API_WS_URL}/api/socket`);
    }
    return socket;
};

export const groupApi = commonApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query<Group[], void>({
            query: () => '/group',
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState, dispatch }) {
                const ws = getSocket();

                try {
                    await cacheDataLoaded;

                    const state = getState() as RootState;

                    ws.send(socketMessage('auth', { token: `Bearer ${state.token.accessToken}` }));

                    ws.onmessage = (event: MessageEvent) => {
                        const { type, data } = parseSocketMessage(event.data);
                        switch (type) {
                            case 'recieveMessage': {
                                updateCachedData((draft) => {
                                    const groupIndex = draft.findIndex((g) => g._id === data.group);
                                    if (groupIndex !== -1) {
                                        const group = draft[groupIndex];
                                        group.lastMessage = data;
                                        if (groupIndex !== 0) {
                                            draft.splice(groupIndex, 1);
                                            draft.unshift(group);
                                        }
                                    }
                                });
                                dispatch(
                                    groupApi.util.updateQueryData('getMessages', data.group, (draft) => {
                                        draft.push(data);
                                    })
                                );
                                break;
                            }
                            case 'online': {
                                dispatch(
                                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                                        const user = draft?.users[data._id];
                                        if (user) {
                                            user.isOnline = true;
                                        }
                                    })
                                );
                                break;
                            }
                            case 'offline': {
                                dispatch(
                                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                                        const user = draft?.users[data._id];
                                        if (user) {
                                            user.isOnline = false;
                                            user.lastSeen = data.lastSeen;
                                        }
                                    })
                                );
                                break;
                            }
                            default:
                                break;
                        }
                    };
                } catch {
                    // TODO
                }
                await cacheEntryRemoved;
                ws.close();
            },
        }),

        getMessages: builder.query<Message[], string>({
            query: (id) => `/group/${id}`,
        }),

        sendMessage: builder.mutation<void, MessageRequest>({
            queryFn: (data) => {
                const socket = getSocket();
                return new Promise((resolve) => {
                    socket.send(socketMessage('sendMessage', data));
                    resolve({ data: undefined });
                });
            },
        }),

        createGroup: builder.mutation<Pick<Group, '_id'>, GroupRequest>({
            queryFn: async (arg, api, _extraOptions, baseQuery) => {
                const users = arg.users.map((user) => user._id);
                const result = await baseQuery({
                    url: '/group',
                    method: 'POST',
                    body: { ...arg, users },
                });
                if (result.error) return { error: result.error };

                const resultData = result.data as Pick<Group, '_id'>;

                api.dispatch(
                    groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                        draft.unshift({ _id: resultData._id, ...arg, users });
                    })
                );
                api.dispatch(
                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                        if (draft) {
                            arg.users.forEach((user) => {
                                if (!draft.users[user._id]) draft.users[user._id] = user;
                            });
                        }
                    })
                );

                return { data: resultData };
            },
        }),

        deleteGroup: builder.mutation<void, Pick<Group, '_id'>>({
            query: ({ _id }) => ({
                url: `/group/${_id}`,
                method: 'DELETE',
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;

                    dispatch(
                        groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                            return draft.filter((group) => group._id !== arg._id);
                        })
                    );
                } catch (e) {}
            },
        }),

        updateGroup: builder.mutation<void, GroupRequest>({
            queryFn: async (arg, api, _extraOptions, baseQuery) => {
                const users = arg.users.map((user) => user._id);
                const result = await baseQuery({
                    url: `/group/${arg._id}`,
                    method: 'PUT',
                    body: {
                        ...arg,
                        users,
                    },
                });
                if (result.error) return { error: result.error };

                api.dispatch(
                    groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                        const group = draft.find((group) => group._id === arg._id);
                        if (group) {
                            group.name = arg.name;
                            group.users = users;
                        }
                    })
                );
                api.dispatch(
                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                        if (draft) {
                            arg.users.forEach((user) => {
                                if (!draft.users[user._id]) draft.users[user._id] = user;
                            });
                        }
                    })
                );

                return { data: result.data as void };
            },
        }),
    }),
});
