import Fastify from 'fastify';

import authenticate from './plugins/authenticate.js';
import database from './plugins/database.js';
import swagger from './plugins/swagger.js';
import env from './plugins/env.js';
import socket from './plugins/socket.js';
import cors from './plugins/cors.js';

import userModule from './routes/user/index.js';
import socketModule from './routes/socket/index.js';
import groupModule from './routes/group/index.js';

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
        instance.register(userModule, { prefix: '/user' });
        instance.register(groupModule, { prefix: '/group' });
        instance.register(socketModule, { prefix: '/socket' });
    },
    { prefix: '/api' }
);

try {
    await fastify.listen({ port: Number(fastify.config.PORT) });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
