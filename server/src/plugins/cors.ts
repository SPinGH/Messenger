import fp from 'fastify-plugin';
import Cors from '@fastify/cors';

const cors = fp(async (fastify, opts) => {
    await fastify.register(Cors);
});

export default cors;
