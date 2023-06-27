import Fastify from 'fastify';

import authenticate from './plugins/authenticate.js';
import database from './plugins/database.js';
import swagger from './plugins/swagger.js';
import env from './plugins/env.js';
import socket from './plugins/socket.js';
import cors from './plugins/cors.js';

import userModule from './user/index.js';
import socketModule from './socket/index.js';
import groupModule from './group/index.js';

const fastify = Fastify({
    logger: true,
});

await fastify.register(env);
fastify.register(cors);
fastify.register(database);
fastify.register(socket);
fastify.register(authenticate);
fastify.register(swagger);

fastify.register(
    async (instance) => {
        instance.register(userModule);
        instance.register(groupModule);
        instance.register(socketModule);
    },
    { prefix: '/api' }
);

try {
    await fastify.listen({ port: Number(fastify.config.PORT) });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
