import { createClient, RedisClient } from 'redis';

import { RedisConfig } from '../interfaces';
import { DefaultValues } from '../common';

export class RedisClientManager {

    private _client: RedisClient;

    constructor(config: RedisConfig) {
        // If no retry strategy provided, we'll use the default one
        config.retry_strategy =
            config.retry_strategy || DefaultValues.RETRY_STRATEGY(config.reconnect_interval);

        // Removed unused properties by RedisConfig
        delete config.reconnect_interval;

        // Create the redis client
        this._client = createClient(config);
    }

    public get client(): RedisClient {
        return this._client;
    }
}
