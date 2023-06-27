import fp from 'fastify-plugin';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { Group } from './schemas/group.js';
import { getGroupResponseItem, getGroupSchema } from './schemas/getGroup.js';
import { getGroupMessagesSchema } from './schemas/getGroupMessages.js';
import { Message } from './schemas/message.js';
import { createGroupSchema } from './schemas/createGroup.js';
import { updateGroupSchema } from './schemas/updateGroup.js';
import { deleteGroupSchema } from './schemas/deleteGroup.js';

const group: FastifyPluginAsyncJsonSchemaToTs = fp(async (fastify, opts) => {
    const groupCollection = fastify.mongo.db!.collection<Group>('group');
    const messageCollection = fastify.mongo.db!.collection<Message>('message');

    fastify.get('/group', { schema: getGroupSchema, onRequest: fastify.authenticate }, async (request, reply) => {
        const groups = await groupCollection
            .aggregate<getGroupResponseItem>([
                { $match: { users: new fastify.mongo.ObjectId(request.user.id) } },
                {
                    $lookup: {
                        from: 'user',
                        localField: 'users',
                        foreignField: '_id',
                        as: 'users',
                    },
                },
                {
                    $lookup: {
                        from: 'message',
                        localField: 'lastMessage',
                        foreignField: '_id',
                        as: 'lastMessage',
                    },
                },
                { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
                { $project: { users: { salt: 0, password: 0 } } },
                { $sort: { 'lastMessage.date': -1 } },
            ])
            .toArray();

        return groups.map((group) => {
            if (group.isDialog) {
                return {
                    ...group,
                    name:
                        group.users.find((user) => user._id.toString() !== request.user.id)?.username ??
                        'Saved messages',
                };
            }
            return group;
        });
    });

    fastify.get(
        '/group/:id',
        {
            schema: getGroupMessagesSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            return await messageCollection.find({ group: new fastify.mongo.ObjectId(request.params.id) }).toArray();
        }
    );

    fastify.post(
        '/group',
        {
            schema: createGroupSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const { name, users, isDialog } = request.body;
            const { insertedId } = await groupCollection.insertOne({
                name,
                users: users.map((userId) => new fastify.mongo.ObjectId(userId)),
                lastMessage: null,
                isDialog,
            });

            return { _id: insertedId };
        }
    );

    fastify.put(
        '/group/:id',
        {
            schema: updateGroupSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const { name, users } = request.body;

            const group = {} as Group;
            if (name) group.name = name;
            if (users) group.users = users.map((userId) => new fastify.mongo.ObjectId(userId));

            const { matchedCount } = await groupCollection.updateOne(
                { _id: new fastify.mongo.ObjectId(request.params.id) },
                {
                    $set: group,
                }
            );

            if (matchedCount === 0) {
                reply.status(404);
                throw new Error('Group not found');
            }

            return { message: 'Group successfully updated' };
        }
    );

    fastify.delete(
        '/group/:id',
        {
            schema: deleteGroupSchema,
            onRequest: (req, rep) => fastify.authenticate(req, rep),
        },
        async (request, reply) => {
            const _id = new fastify.mongo.ObjectId(request.params.id);

            const { deletedCount } = await groupCollection.deleteOne({ _id });

            if (deletedCount === 0) {
                reply.status(404);
                throw new Error('Group not found');
            }

            await messageCollection.deleteMany({ group: _id });

            return { message: 'Group successfully updated' };
        }
    );
});

export default group;
