import fp from 'fastify-plugin';
import JWT from '@fastify/jwt';
import { RouteHandlerMethod } from 'fastify';

const authenticate = fp(async (fastify, opts) => {
    fastify.register(JWT, {
        secret: fastify.config.JWT_SECRET,
    });

    fastify.decorate<RouteHandlerMethod>('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

export default authenticate;
