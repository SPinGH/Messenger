import { userScheme } from '../model/user.js';

export const getUserByIdSchema = {
    security: [{ Bearer: [] }],
    tags: ['User'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string' },
        },
        required: ['id'],
    } as const,
    response: {
        200: userScheme,
    },
};
