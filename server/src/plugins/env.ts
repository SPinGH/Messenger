import fp from 'fastify-plugin';
import ENV from '@fastify/env';
import { FromSchema } from 'json-schema-to-ts';

const schema = {
    type: 'object',
    properties: {
        PORT: {
            type: 'string',
            default: '5000',
        },
        JWT_SECRET: {
            type: 'string',
            default: 'secret',
        },
        MONGO_URL: {
            type: 'string',
            default: 'mongodb://127.0.0.1:27017/messenger',
        },
    },
    required: ['PORT', 'JWT_SECRET', 'MONGO_URL'],
} as const;

const env = fp(async (fastify, opts) => {
    await fastify.register(ENV, { schema, dotenv: true });
});

export default env;
export type ENVType = FromSchema<typeof schema>;
