import { FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import JWT from '@fastify/jwt';

const authenticate = fp(async (fastify, opts) => {
    fastify.register(JWT, {
        secret: fastify.config.JWT_SECRET,
    });

    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

export default authenticate;
