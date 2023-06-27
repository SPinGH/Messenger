import { ObjectId } from '@fastify/mongodb';
import { FromSchema } from 'json-schema-to-ts';
import { getUserSchema } from '../../user/schemas/getUser.js';
import { messageScheme } from './message.js';

export const groupScheme = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isDialog: { type: 'boolean' },
        users: {
            type: 'array',
            items: getUserSchema.response[200],
        },
        lastMessage: messageScheme,
    },
    required: ['_id', 'name', 'isDialog', 'users'],
} as const;

export type Group = Pick<
    FromSchema<typeof groupScheme>,
    Exclude<keyof typeof groupScheme.properties, '_id' | 'users' | 'lastMessage'>
> & {
    users: ObjectId[];
    lastMessage: ObjectId | null;
};
