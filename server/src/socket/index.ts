import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import fp from 'fastify-plugin';
import { WebSocket } from 'ws';
import { parseSocketMessage, socketMessage } from './lib/socketMessage.js';
import { Message } from './schemas/message.js';
import { User } from '../user/schemas/user.js';

const activeUsers: Map<string, WebSocket> = new Map();

const socket: FastifyPluginAsyncJsonSchemaToTs = fp(async (fastify, opts) => {
    const userCollection = fastify.mongo.db!.collection<User>('user');
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

                    const history = await messageCollection.find().toArray();
                    connection.socket.send(socketMessage('history', history));
                } catch (error) {
                    connection.socket.send(socketMessage('error', 'Not authenticated'));
                }
            } else if (currentUser !== null) {
                switch (type) {
                    case 'message':
                        const text = `${currentUser.username}: ${data}`;
                        await messageCollection.insertOne({
                            author: currentUser._id.toHexString(),
                            date: new Date().toISOString(),
                            text,
                        });
                        activeUsers.forEach((user) => user.send(socketMessage('message', text)));
                        break;

                    default:
                        break;
                }
            }
        });
    });
});

export default socket;
