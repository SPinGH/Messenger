import { groupScheme } from '../model/group.js';

export const getGroupSchema = {
    security: [{ Bearer: [] }],
    tags: ['Group'],
    response: {
        200: {
            type: 'array',
            items: groupScheme,
        } as const,
    },
};
