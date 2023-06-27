export const getUsersSchema = {
    security: [{ Bearer: [] }],
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
        },
    } as const,
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                },
                required: ['_id', 'username'],
            },
        },
    },
};
