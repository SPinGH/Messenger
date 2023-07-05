export const changePasswordSchema = {
    security: [{ Bearer: [] }],
    tags: ['User'],
    body: {
        type: 'object',
        properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string' },
        },
        required: ['oldPassword', 'newPassword'],
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
