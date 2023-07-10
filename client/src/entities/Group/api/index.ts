import { commonApi } from '@/shared/api';
import { Group, GroupRequest, Message, MessageRequest } from '..';
import { parseSocketMessage, socketMessage } from '../lib/socketMessage';
import { userApi } from '@/entities/User';
import { getSocket } from '../lib/socket';

export const groupApi = commonApi.injectEndpoints({
    endpoints: (builder) => ({
        getGroups: builder.query<Group[], void>({
            query: () => '/group',
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
                const ws = getSocket();

                try {
                    await cacheDataLoaded;

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
                                dispatch(
                                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                                        if (draft) {
                                            draft.newMessages[data.group] = (draft.newMessages[data.group] ?? 0) + 1;
                                        }
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
                            case 'createGroup': {
                                dispatch(
                                    groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                                        draft.unshift(data);
                                    })
                                );
                                break;
                            }
                            case 'updateGroup': {
                                dispatch(
                                    groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                                        return draft.map((group) => {
                                            if (group._id === data._id) return { ...group, ...data };
                                            return group;
                                        });
                                    })
                                );
                                break;
                            }
                            case 'deleteGroup': {
                                dispatch(
                                    groupApi.util.updateQueryData('getGroups', undefined, (draft) => {
                                        return draft.filter((group) => group._id !== data._id);
                                    })
                                );
                                break;
                            }
                            case 'updateUser': {
                                dispatch(
                                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                                        const user = draft?.users[data._id];
                                        if (user) {
                                            draft.users[user._id] = { ...user, ...data };
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
                ws.close(1000);
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

        viewMessages: builder.mutation<void, Group['_id']>({
            queryFn: (id, api) => {
                const socket = getSocket();
                api.dispatch(
                    userApi.util.updateQueryData('getUserInfo', undefined, (draft) => {
                        if (draft) {
                            draft.newMessages[id] = 0;
                        }
                    })
                );
                return new Promise((resolve) => {
                    socket.send(socketMessage('viewMessages', { group: id }));
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
