import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { socketMessage } from '../socket/lib/socketMessage.js';
import { Group, GroupResponse } from './model/group.js';
import { activeUsers } from '../socket/index.js';
import { User } from '../user/model/user.js';
import { Message } from './model/message.js';
import {
    getGroupSchema,
    getGroupMessagesSchema,
    createGroupSchema,
    updateGroupSchema,
    deleteGroupSchema,
} from './schemas/index.js';

const group: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts) => {
    const userCollection = fastify.mongo.db!.collection<User>('user');
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
        const group = {
            name: isDialog ? '' : name,
            users: users.map((userId) => new fastify.mongo.ObjectId(userId)),
            lastMessage: null,
            isDialog,
        };

        const { insertedId } = await groupCollection.insertOne(group);
        users.forEach((userId) => {
            if (userId !== request.user.id) {
                activeUsers.get(userId)?.send(socketMessage('createGroup', { _id: insertedId, ...group }));
            }
        });

        return { _id: insertedId.toHexString() };
    });

    fastify.put('/:id', { schema: updateGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const { name, users } = request.body;

        const group = await groupCollection.findOne({ _id: new fastify.mongo.ObjectId(request.params.id) });

        if (!group) {
            reply.status(404);
            throw new Error('Group not found');
        }

        const newGroup = {} as Group;
        if (name) newGroup.name = name;
        if (users) newGroup.users = users.map((userId) => new fastify.mongo.ObjectId(userId));

        await groupCollection.updateOne({ _id: group._id }, { $set: newGroup });

        const newUsers = new Set(users);
        for await (const userId of group.users) {
            const _id = userId.toHexString();
            if (users && !newUsers.has(_id)) {
                activeUsers.get(_id)?.send(socketMessage('deleteGroup', { _id: group._id.toHexString() }));
                await userCollection.updateOne(
                    { _id: userId },
                    {
                        $unset: { [`newMessages.${group._id}`]: 1 },
                    }
                );
            } else if (_id !== request.user.id) {
                activeUsers.get(_id)?.send(socketMessage('updateGroup', { _id: group._id, ...newGroup }));
            }
            newUsers.delete(_id);
        }
        if (newUsers.size !== 0) {
            let lastMessage = group.lastMessage && (await messageCollection.findOne({ _id: group.lastMessage }));
            newUsers.forEach((userId) => {
                activeUsers
                    .get(userId)
                    ?.send(socketMessage('createGroup', { ...group, ...newGroup, lastMessage } as any));
            });
        }

        return { message: 'Group successfully updated' };
    });

    fastify.delete('/:id', { schema: deleteGroupSchema, onRequest: [fastify.authenticate] }, async (request, reply) => {
        const _id = new fastify.mongo.ObjectId(request.params.id);

        const group = await groupCollection.findOne({ _id: new fastify.mongo.ObjectId(request.params.id) });

        if (!group) {
            reply.status(404);
            throw new Error('Group not found');
        }

        await groupCollection.deleteOne({ _id });
        await messageCollection.deleteMany({ group: _id });

        for await (const userId of group.users) {
            if (userId.toHexString() !== request.user.id) {
                activeUsers
                    .get(userId.toHexString())
                    ?.send(socketMessage('deleteGroup', { _id: group._id.toHexString() }));
                await userCollection.updateOne(
                    { _id: userId },
                    {
                        $unset: { [`newMessages.${group._id}`]: 1 },
                    }
                );
            }
        }

        return { message: 'Group successfully updated' };
    });
};

export default group;
