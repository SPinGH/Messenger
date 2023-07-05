import { ObjectId } from '@fastify/mongodb';
import { FromSchema } from 'json-schema-to-ts';

export const messageScheme = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        date: { type: 'string' },
        author: { type: 'string' },
        text: { type: 'string' },
        group: { type: 'string' },
    },
    required: ['_id', 'date', 'author', 'text', 'group'],
} as const;

export type Message = Pick<
    FromSchema<typeof messageScheme>,
    Exclude<keyof typeof messageScheme.properties, '_id' | 'author' | 'group'>
> & {
    _id?: ObjectId;
    author: ObjectId;
    group: ObjectId;
};
