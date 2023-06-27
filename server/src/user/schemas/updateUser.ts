export const updateUserSchema = {
    security: [{ Bearer: [] }],
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
