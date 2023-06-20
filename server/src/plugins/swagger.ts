import fp from 'fastify-plugin';
import Swagger from '@fastify/swagger';
import SwaggerUI, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

const swagger = fp(async (fastify, opts) => {
    await fastify.register(Swagger, {
        swagger: {
            info: {
                title: 'Messenger swagger',
                version: '0.1.0',
            },
            securityDefinitions: {
                Bearer: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'Enter the token with the "Bearer: " prefix, e.g. "Bearer abcde12345"',
                },
            },
        },
    });

    fastify.register<FastifySwaggerUiOptions>(SwaggerUI, {
        routePrefix: '/docs',
    });
});

export default swagger;
