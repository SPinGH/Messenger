import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { randomBytes, timingSafeEqual } from 'node:crypto';

import { hashPassword } from './lib/hashPassword.js';
import { Group } from '../group/model/group.js';
import { User } from './model/user.js';
import {
    authSchema,
    getUserSchema,
    getUsersSchema,
    getUserByIdSchema,
    updateUserSchema,
    changePasswordSchema,
} from './schemas/index.js';

const user: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
    const groupCollection = fastify.mongo.db!.collection<Group>('group');
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

        const user = await userCollection.insertOne({
            username,
            salt,
            password: hashedPassword,
            isOnline: false,
            lastSeen: new Date().toISOString(),
        });
        const token = fastify.jwt.sign({ id: user.insertedId.toHexString() });

        return { token };
    });

    fastify.post('/signin', { schema: authSchema }, async (request, reply) => {
        const { username, password } = request.body;

        const user = await userCollection.findOne({ username });
        if (user) {
            const hashedPassword = await hashPassword(password, user.salt);

            if (timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(user.password, 'hex'))) {
                const token = fastify.jwt.sign({ id: user._id.toHexString() });

                return { token };
            }
        }

        reply.code(400);
        throw new Error('Invalid username or password');
    });

    fastify.get('/all', { schema: getUsersSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const { username } = request.query;

        return (await userCollection.find({ username: { $regex: `^${username}`, $options: 'i' } }).toArray()) as any;
    });

    fastify.get('/:id', { schema: getUserByIdSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const user = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.params.id) });

        if (!user) {
            reply.code(404);
            throw new Error('User not found');
        }

        return user as any;
    });

    fastify.get('/', { schema: getUserSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const user = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.user.id) });

        if (!user) {
            reply.code(404);
            throw new Error('User not found');
        }

        const groups = await groupCollection.find({ users: user._id }).toArray();
        const userIds = Array.from(
            groups.reduce((acc, group) => {
                group.users.forEach((user) => acc.add(user.toHexString()));
                return acc;
            }, new Set() as Set<string>)
        ).map((user) => new fastify.mongo.ObjectId(user));

        const users = await userCollection.find({ _id: { $in: userIds } }).toArray();

        return { user, users } as any;
    });

    fastify.put('/', { schema: updateUserSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const { username } = request.body;

        if (await userCollection.findOne({ username })) {
            reply.code(400);
            throw new Error('User with this username already exists');
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
    });

    fastify.put(
        '/password',
        { schema: changePasswordSchema, onRequest: [fastify.authenticate] },
        async (request, reply) => {
            const { oldPassword, newPassword } = request.body;

            const userId = new fastify.mongo.ObjectId(request.user.id);

            const user = await userCollection.findOne({ _id: userId });
            if (user) {
                const hashedPassword = await hashPassword(oldPassword, user.salt);

                if (!timingSafeEqual(Buffer.from(hashedPassword, 'hex'), Buffer.from(user.password, 'hex'))) {
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
};

export default user;
