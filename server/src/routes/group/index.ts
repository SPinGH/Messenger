import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { Group, GroupResponse } from './model/group.js';
import { activeUsers } from '../socket/index.js';
import { Message } from './model/message.js';
import {
    getGroupSchema,
    getGroupMessagesSchema,
    createGroupSchema,
    updateGroupSchema,
    deleteGroupSchema,
} from './schemas/index.js';
import { socketMessage } from '../socket/lib/socketMessage.js';

const group: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts) => {
    const groupCollection = fastify.mongo.db!.collection<Group>('group');
    const messageCollection = fastify.mongo.db!.collection<Message>('message');

    fastify.get('/', { schema: getGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const groups = await groupCollection
            .aggregate<GroupResponse>([
                { $match: { users: new fastify.mongo.ObjectId(request.user.id) } },
                {
                    $lookup: {
                        from: 'message',
                        localField: 'lastMessage',
                        foreignField: '_id',
                        as: 'lastMessage',
                    },
                },
                { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
                { $sort: { 'lastMessage.date': -1 } },
            ])
            .toArray();

        return groups as any;
    });

    fastify.get(
        '/:id',
        { schema: getGroupMessagesSchema, onRequest: [fastify.authenticate] },
        async (request, reply) => {
            return (await messageCollection
                .find({ group: new fastify.mongo.ObjectId(request.params.id) })
                .toArray()) as any;
        }
    );

    fastify.post('/', { schema: createGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const { name, users, isDialog } = request.body;
        const { insertedId } = await groupCollection.insertOne({
            name: isDialog ? '' : name,
            users: users.map((userId) => new fastify.mongo.ObjectId(userId)),
            lastMessage: null,
            isDialog,
        });

        return { _id: insertedId.toHexString() };
    });

    fastify.put('/:id', { schema: updateGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
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
    });

    fastify.delete('/:id', { schema: deleteGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const _id = new fastify.mongo.ObjectId(request.params.id);

        const { deletedCount } = await groupCollection.deleteOne({ _id });

        if (deletedCount === 0) {
            reply.status(404);
            throw new Error('Group not found');
        }

        await messageCollection.deleteMany({ group: _id });

        return { message: 'Group successfully updated' };
    });
};

export default group;
