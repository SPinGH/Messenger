import { Message } from '../../group/schemas/message.js';

interface SocketMessageMap {
    auth: string;
    sendMessage: { group: string; text: string };
    recieveMessage: WithId<Message>;
    error: string;
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
