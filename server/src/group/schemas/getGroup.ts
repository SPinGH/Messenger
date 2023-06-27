import { FromSchema } from 'json-schema-to-ts';
import { groupScheme } from './group.js';

export const getGroupSchema = {
    security: [{ Bearer: [] }],
    response: {
        200: {
            type: 'array',
            items: groupScheme,
        },
    },
};

export type getGroupResponseItem = FromSchema<typeof groupScheme>;
