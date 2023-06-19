declare type WithId<T> = T & {
    _id: import('@fastify/mongodb').ObjectId;
};
