import fp from 'fastify-plugin';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { authSchema } from './schemas/auth.js';
import { hashPassword } from './lib/hashPassword.js';
import { User } from './schemas/user.js';
import { getUserSchema } from './schemas/getUser.js';
import { getUsersSchema } from './schemas/getUsers.js';
import { getUserByIdSchema } from './schemas/getUserById.js';
import { updateUserSchema } from './schemas/updateUser.js';
import { changePasswordSchema } from './schemas/changePassword.js';

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

    fastify.get(
        '/user',
        {
            schema: getUserSchema,
            onRequest: fastify.authenticate,
        },
        async (request, reply) => {
            const candidate = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.user.id) });

            if (!candidate) {
                reply.code(404);
                throw new Error('User not found');
            }

            return candidate;
        }
    );

    fastify.get(
        '/user/:id',
        {
            schema: getUserByIdSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const candidate = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.params.id) });

            if (!candidate) {
                reply.code(404);
                throw new Error('User not found');
            }

            return candidate;
        }
    );

    fastify.put(
        '/user',
        {
            schema: updateUserSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const { username } = request.body;

            if (await userCollection.findOne({ username })) {
                reply.code(400);
                throw new Error('Invalid username');
            }

            const { matchedCount } = await userCollection.updateOne(
                { _id: new fastify.mongo.ObjectId(request.user.id) },
                { $set: { username } }
            );

            if (matchedCount === 0) {
                reply.code(404);
                throw new Error('User not found');
            }

            return { message: 'User successfully updated' };
        }
    );

    fastify.put(
        '/user/password',
        {
            schema: changePasswordSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const { oldPassword, newPassword } = request.body;

            const userId = new fastify.mongo.ObjectId(request.user.id);

            const candidate = await userCollection.findOne({ _id: userId });
            if (candidate) {
                const hashedPassword = await hashPassword(oldPassword, candidate.salt);

                if (!timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(candidate.password, 'hex'))) {
                    reply.code(400);
                    throw new Error('Invalid password');
                }

                const salt = randomBytes(16).toString('hex');
                const newHashedPassword = await hashPassword(newPassword, salt);

                await userCollection.updateOne({ _id: userId }, { $set: { password: newHashedPassword, salt } });

                return { message: 'User successfully updated' };
            }

            reply.code(404);
            throw new Error('User not found');
        }
    );

    fastify.get(
        '/users',
        {
            schema: getUsersSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const { username } = request.query;

            return await userCollection.find({ username: { $regex: `^${username}`, $options: 'i' } }).toArray();
        }
    );
});

export default user;
