import { ObjectId } from '@fastify/mongodb';
import { FromSchema } from 'json-schema-to-ts';
import { messageScheme } from './message.js';

export const groupScheme = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isDialog: { type: 'boolean' },
        users: { type: 'array', items: { type: 'string' } },
        lastMessage: messageScheme,
    },
    required: ['_id', 'name', 'isDialog', 'users'],
} as const;

export type Group = Pick<
    FromSchema<typeof groupScheme>,
    Exclude<keyof typeof groupScheme.properties, '_id' | 'users' | 'lastMessage'>
> & {
    _id?: ObjectId;
    users: ObjectId[];
    lastMessage: ObjectId | null;
};

export type GroupResponse = FromSchema<typeof groupScheme>;
