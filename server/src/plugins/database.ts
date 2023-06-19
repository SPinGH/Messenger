import fp from 'fastify-plugin';
import Mongo from '@fastify/mongodb';

const database = fp(async (fastify, opts) => {
    await fastify.register(Mongo, {
        url: fastify.config.MONGO_URL,
    });
});

export default database;
