import { ObjectId } from '@fastify/mongodb';
import { FromSchema } from 'json-schema-to-ts';

export const userScheme = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        username: { type: 'string' },
        isOnline: { type: 'boolean' },
        lastSeen: { type: 'string' },
    },
    required: ['_id', 'username', 'isOnline', 'lastSeen'],
} as const;

export type User = Pick<FromSchema<typeof userScheme>, Exclude<keyof typeof userScheme.properties, '_id'>> & {
    _id?: ObjectId;
    salt: string;
    password: string;
    newMessages: Record<string, number>;
};
