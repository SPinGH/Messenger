import fp from 'fastify-plugin';
import WebSocket from '@fastify/websocket';

const socket = fp(async (fastify, opts) => {
    await fastify.register(WebSocket);
});

export default socket;
