import { Message } from '../../group/model/message.js';

interface SocketMessageMap {
    auth: { token: string };
    online: { _id: string };
    offline: { _id: string; lastSeen: string };
    sendMessage: { group: string; text: string };
    recieveMessage: WithId<Message>;
    error: { message: string };
}

type SocketMessage = {
    [K in keyof SocketMessageMap]: {
        type: K;
        data: SocketMessageMap[K];
    };
}[keyof SocketMessageMap];

export const socketMessage = <T extends keyof SocketMessageMap>(type: T, data: SocketMessageMap[T]) =>
    JSON.stringify({ type, data });

export const parseSocketMessage = (message: string) => {
    return JSON.parse(message) as SocketMessage;
};
