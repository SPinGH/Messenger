import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import { parseSocketMessage, socketMessage } from './lib/socketMessage.js';
import { Message } from '../group/schemas/message.js';
import { User } from '../user/schemas/user.js';
import { Group } from '../group/schemas/group.js';

const activeUsers: Map<string, WebSocket> = new Map();

const socket: FastifyPluginAsyncJsonSchemaToTs = fp(async (fastify, opts) => {
    const userCollection = fastify.mongo.db!.collection<User>('user');
    const groupCollection = fastify.mongo.db!.collection<Group>('group');
    const messageCollection = fastify.mongo.db!.collection<Message>('message');

    fastify.get('/socket', { websocket: true }, async (connection, request) => {
        let currentUser: WithId<User> | null = null;

        connection.socket.on('close', () => {
            if (request.user) activeUsers.delete(request.user.id);
        });

        connection.socket.on('message', async (message) => {
            const { type, data } = parseSocketMessage(message.toString());

            if (type === 'auth') {
                try {
                    request.headers.authorization = data;
                    await request.jwtVerify();

                    activeUsers.set(request.user.id, connection.socket);
                    currentUser = await userCollection.findOne({ _id: new fastify.mongo.ObjectId(request.user.id) });
                } catch (error) {
                    connection.socket.send(socketMessage('error', 'Not authenticated'));
                }
            } else if (currentUser !== null) {
                switch (type) {
                    case 'sendMessage':
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

                    default:
                        break;
                }
            }
        });
    });
});

export default socket;
