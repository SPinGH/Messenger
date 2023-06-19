import fp from 'fastify-plugin';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { authSchema } from './schemas/auth.js';
import { hashPassword } from './lib/hashPassword.js';
import { User } from './schemas/user.js';

const user: FastifyPluginAsyncJsonSchemaToTs = fp(async (fastify, opts) => {
    const userCollection = fastify.mongo.db!.collection<User>('user');

    fastify.post('/signup', { schema: authSchema }, async (request, reply) => {
        const { username, password } = request.body;

        const candidate = await userCollection.findOne({ username });
        if (candidate) {
            reply.code(400);
            throw new Error('User with this username already exists');
        }

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = await hashPassword(password, salt);

        const user = await userCollection.insertOne({ username, salt, password: hashedPassword });

        const token = fastify.jwt.sign({ id: user.insertedId.toHexString() });

        return { token };
    });

    fastify.post('/login', { schema: authSchema }, async (request, reply) => {
        const { username, password } = request.body;

        const candidate = await userCollection.findOne({ username });
        if (candidate) {
            const hashedPassword = await hashPassword(password, candidate.salt);

            if (timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(candidate.password, 'hex'))) {
                const token = fastify.jwt.sign({ id: candidate._id.toHexString() });

                return { token };
            }
        }

        reply.code(400);
        throw new Error('Invalid username or password');
    });
});

export default user;
