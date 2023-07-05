import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { WebSocket } from 'ws';

import { Message } from '../group/model/message.js';
import { Group } from '../group/model/group.js';
import { User } from '../user/model/user.js';

import { parseSocketMessage, socketMessage } from './lib/socketMessage.js';
import { socketSchema } from './schemas/index.js';

export const activeUsers: Map<string, WebSocket> = new Map();

const socket: FastifyPluginAsyncJsonSchemaToTs = async (fastify, opts) => {
    const userCollection = fastify.mongo.db!.collection<User>('user');
    const groupCollection = fastify.mongo.db!.collection<Group>('group');
    const messageCollection = fastify.mongo.db!.collection<Message>('message');

    fastify.get('/', { schema: socketSchema, websocket: true }, async (connection, request) => {
        let currentUser: WithId<User> | null = null;

        connection.socket.on('close', async () => {
            if (request.user && currentUser) {
                activeUsers.delete(request.user.id);

                const lastSeen = new Date().toISOString();
                await userCollection.updateOne({ _id: currentUser._id }, { $set: { isOnline: false, lastSeen } });
                const userIds = Array.from(
                    (await groupCollection.find({ users: currentUser._id }).toArray()).reduce((acc, group) => {
                        group.users.forEach((user) => acc.add(user.toHexString()));
                        return acc;
                    }, new Set() as Set<string>)
                );
                userIds.forEach((_id) => {
                    activeUsers.get(_id)?.send(socketMessage('offline', { _id: request.user.id, lastSeen }));
                });
            }
        });

        connection.socket.on('message', async (message) => {
            const { type, data } = parseSocketMessage(message.toString());

            if (type === 'auth') {
                try {
                    request.headers.authorization = data.token;
                    await request.jwtVerify();

                    currentUser = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.user.id) });
                    if (currentUser) {
                        activeUsers.set(request.user.id, connection.socket);

                        await userCollection.updateOne({ _id: currentUser._id }, { $set: { isOnline: true } });
                        const userIds = Array.from(
                            (await groupCollection.find({ users: currentUser._id }).toArray()).reduce((acc, group) => {
                                group.users.forEach((user) => acc.add(user.toHexString()));
                                return acc;
                            }, new Set() as Set<string>)
                        );
                        userIds.forEach((_id) => {
                            activeUsers.get(_id)?.send(socketMessage('online', { _id: request.user.id }));
                        });
                    }
                } catch (error) {
                    console.log(error);

                    connection.socket.send(socketMessage('error', { message: 'Not authenticated' }));
                }
            } else if (currentUser !== null) {
                switch (type) {
                    case 'sendMessage': {
                        const group = await groupCollection.findOne({ _id: new fastify.mongo.ObjectId(data.group) });

                        if (group) {
                            const message = {
                                author: currentUser._id,
                                date: new Date().toISOString(),
                                text: data.text,
                                group: group._id,
                            };
                            const { insertedId } = await messageCollection.insertOne(message);

                            await groupCollection.updateOne({ _id: group._id }, { $set: { lastMessage: insertedId } });

                            group.users.forEach((userId) =>
                                activeUsers.get(userId.toHexString())?.send(
                                    socketMessage('recieveMessage', {
                                        _id: insertedId,
                                        ...message,
                                    })
                                )
                            );
                        }

                        break;
                    }

                    default:
                        break;
                }
            }
        });
    });
};

export default socket;
