import { Group, Message, MessageRequest } from '..';
import { User } from '@/entities/User';

interface SocketMessageMap {
    auth: { token: string };
    error: { message: string };

    online: { _id: string };
    offline: { _id: string; lastSeen: string };

    sendMessage: MessageRequest;
    recieveMessage: Message;

    createGroup: Group;
    updateGroup: WithRequired<Partial<Group>, '_id'>;
    deleteGroup: { _id: string };

    updateUser: WithRequired<Partial<User>, '_id'>;
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
