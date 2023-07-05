export const updateUserSchema = {
    security: [{ Bearer: [] }],
    tags: ['User'],
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
        },
        required: ['username'],
    } as const,
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
            required: ['message'],
        } as const,
    },
};
