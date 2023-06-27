export const updateGroupSchema = {
    security: [{ Bearer: [] }],
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            users: { type: 'array', items: { type: 'string' } },
        },
    } as const,
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
                message: { type: 'string' },
            },
            required: ['message'],
        } as const,
    },
};
