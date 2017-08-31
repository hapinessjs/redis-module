import { createClient, RedisClient } from 'redis';

import { RedisConfig } from '../interfaces';

export class RedisClientManager {

    private _client: RedisClient;

    constructor(config: RedisConfig) {
        this._client = createClient(config);
    }

    public get client(): RedisClient {
        return this._client;
    }
}
