import { FromSchema } from 'json-schema-to-ts';

export const messageScheme = {
    type: 'object',
    properties: {
        date: { type: 'string' },
        author: { type: 'string' },
        text: { type: 'string' },
    },
    required: ['date', 'author', 'text'],
} as const;

export type Message = FromSchema<typeof messageScheme>;
