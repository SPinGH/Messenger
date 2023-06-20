import { commonApi } from '@/shared/api';
import { Message } from '..';
import { parseSocketMessage, socketMessage } from '../lib/socketMessage';

let socket: WebSocket;

const getSocket = () => {
    if (!socket) {
        socket = new WebSocket(`${import.meta.env.VITE_API_WS_URL}/api/socket`);
    }
    return socket;
};

export const chatApi = commonApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<Message[], void>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState }) {
                const ws = getSocket();

                try {
                    await cacheDataLoaded;

                    const state = getState() as RootState;

                    ws.onopen = () => {
                        ws.send(socketMessage('auth', `Bearer ${state.token.accessToken}`));
                    };

                    ws.onmessage = (event: MessageEvent) => {
                        const { type, data } = parseSocketMessage(event.data);
                        switch (type) {
                            case 'history':
                                updateCachedData(() => data);
                                break;
                            case 'recieveMessage':
                                updateCachedData((draft) => {
                                    draft.push(data);
                                });
                                break;
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

        sendMessage: builder.mutation<void, string>({
            queryFn: (text) => {
                const socket = getSocket();
                return new Promise((resolve) => {
                    socket.send(socketMessage('sendMessage', text));
                    resolve({ data: undefined });
                });
            },
        }),
    }),
});
