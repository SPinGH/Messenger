export const getUserSchema = {
    security: [{ Bearer: [] }],
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
                username: { type: 'string' },
            },
            required: ['_id', 'username'],
        } as const,
    },
};
