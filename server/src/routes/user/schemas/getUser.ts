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
                    type: 'object',
                    additionalProperties: userScheme,
                },
                newMessages: {
                    type: 'object',
                    additionalProperties: { type: 'integer' },
                },
            },
            required: ['user', 'users', 'newMessages'],
        } as const,
    },
};
