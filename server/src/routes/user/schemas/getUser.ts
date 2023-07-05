import { userScheme } from '../model/user.js';

export const getUserSchema = {
    security: [{ Bearer: [] }],
    tags: ['User'],
    response: {
        200: {
            type: 'object',
            properties: {
                user: userScheme,
                users: {
                    type: 'array',
                    items: userScheme,
                },
            },
            required: ['user', 'users'],
        } as const,
    },
};
