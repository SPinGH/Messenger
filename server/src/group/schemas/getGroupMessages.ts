import { messageScheme } from './message.js';

export const getGroupMessagesSchema = {
    security: [{ Bearer: [] }],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string' },
        },
    } as const,
    response: {
        200: {
            type: 'array',
            items: messageScheme,
        },
    },
};
