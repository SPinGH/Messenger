import { Message } from '../../group/model/message.js';
import { Group } from '../../group/model/group.js';
import { User } from '../../user/model/user.js';

interface SocketMessageMap {
    error: { message: string };
    auth: { token: string };

    online: { _id: string };
    offline: { _id: string; lastSeen: string };

    sendMessage: { group: string; text: string };
    viewMessages: { group: string };
    recieveMessage: WithId<Message>;

    createGroup: WithId<Group>;
    updateGroup: WithId<Partial<Group>>;
    deleteGroup: { _id: string };

    updateUser: WithId<Partial<User>>;
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
