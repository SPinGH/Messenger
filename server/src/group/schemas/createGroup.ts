export const createGroupSchema = {
    security: [{ Bearer: [] }],
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            users: { type: 'array', items: { type: 'string' } },
            isDialog: { type: 'boolean' },
        },
        required: ['name', 'users', 'isDialog'],
    } as const,
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type: 'string' },
            },
            required: ['_id'],
        },
    },
};
