export const deleteGroupSchema = {
    security: [{ Bearer: [] }],
    tags: ['Group'],
    params: {
        type: 'object',
        properties: {
            id: { type: 'string' },
        },
    } as const,
    response: {
        200: {
            type: 'string',
        },
    },
};
