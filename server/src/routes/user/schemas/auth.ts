export const authSchema = {
    tags: ['Auth'],
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['username', 'password'],
    } as const,
    response: {
        200: {
            type: 'object',
            properties: {
                token: { type: 'string' },
            },
            required: ['token'],
        } as const,
    },
};
