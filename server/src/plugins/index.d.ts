import '@fastify/jwt';
import 'fastify';
import { RouteHandlerMethod } from 'fastify';
import { ENVType } from './env.ts';
import { User } from '../user/schemas/user.ts';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string };
        user: { id: string };
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: RouteHandlerMethod;
        config: ENVType;
    }
}
