import { userScheme } from '../model/user.js';

export const getUsersSchema = {
    security: [{ Bearer: [] }],
    tags: ['User'],
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
        },
    } as const,
    response: {
        200: {
            type: 'array',
            items: userScheme,
        } as const,
    },
};
