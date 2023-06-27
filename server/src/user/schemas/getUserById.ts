export const getUserByIdSchema = {
    security: [{ Bearer: [] }],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string' },
        },
    } as const,
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                username: { type: 'string' },
            },
            required: ['_id', 'username'],
        },
    },
};
