import fp from 'fastify-plugin';
import JWT from '@fastify/jwt';
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify';

const authenticate = fp(async (fastify, opts) => {
    fastify.register(JWT, {
        secret: fastify.config.JWT_SECRET,
    });

    fastify.decorate('authenticate', async <T extends FastifyRequest, U extends FastifyReply>(request: T, reply: U) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

export default authenticate;
