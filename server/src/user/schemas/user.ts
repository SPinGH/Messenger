import { FromSchema } from 'json-schema-to-ts';

export const userScheme = {
    type: 'object',
    properties: {
        username: { type: 'string' },
        salt: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['username', 'salt', 'password'],
} as const;

export type User = FromSchema<typeof userScheme>;
