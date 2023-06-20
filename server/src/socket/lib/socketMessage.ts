import { Message } from '../schemas/message.js';

interface SocketMessageMap {
    auth: string;
    sendMessage: string;
    recieveMessage: WithId<Message>;
    error: string;
    history: WithId<Message>[];
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
