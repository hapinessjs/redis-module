import { createClient, RedisClient } from 'redis';
import { Observable } from 'rxjs';

import { RedisConfig } from '../interfaces';
import { DefaultValues } from '../common';

export class RedisClientManager {

    private _config: any;
    private _client: RedisClient;

    constructor(config: RedisConfig) {
        // If no retry strategy provided, we'll use the default one
        config.retry_strategy =
            config.retry_strategy || DefaultValues.RETRY_STRATEGY(config.reconnect_interval);

        // Removed unused properties by RedisConfig
        delete config.reconnect_interval;

        // Create the redis client
        this._config = config;
    }

    public createClient() {
        return Observable.create(
            observer => {
                this._client = createClient(this._config);
                this._client.on('ready', () => {
                    observer.next();
                    observer.complete();
                });
                this._client.on('error', err => {
                    observer.error(err);
                });
            }
        );
    }

    public get client(): RedisClient {
        return this._client;
    }
}
