import { TokenStorage } from '@/shared/api';
import { socketMessage } from './socketMessage';

let socket: WebSocket | null = null;

const initializeSocket = () => {
    const savedOnMessage = socket?.onmessage ?? null;

    socket = new WebSocket(`${import.meta.env.VITE_API_WS_URL}/api/socket`);

    const token = TokenStorage.get();
    socket.onopen = () => socket?.send(socketMessage('auth', { token: `Bearer ${token}` }));
    socket.onmessage = savedOnMessage;
    socket.onclose = (event) => {
        if (event.code === 1000) {
            socket = null;
        } else initializeSocket();
    };
};

export const getSocket = (): WebSocket => {
    if (!socket) initializeSocket();
    return socket as WebSocket;
};
