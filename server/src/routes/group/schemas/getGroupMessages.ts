import { messageScheme } from '../model/message.js';

export const getGroupMessagesSchema = {
    security: [{ Bearer: [] }],
    tags: ['Group'],
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
        } as const,
    },
};
