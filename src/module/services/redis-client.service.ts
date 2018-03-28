import { Injectable, Inject } from '@hapiness/core';

import { HapinessRedisClient } from '../../custom-typings/redis-types';

import { RedisExt } from '../redis.extension';

import { RedisClientManager } from '../managers';
import { RedisClient } from 'redis';

@Injectable()
export class RedisClientService {
    constructor(@Inject(RedisExt) private _redisManager: RedisClientManager) {}

    /**
     * Return the HapinessRedisClient
     * You can call all existing redis function on it
     * See documentation at <https://redis.io/commands>
     */
    public get connection(): HapinessRedisClient {
        return this._redisManager.clientObs;
    }

    public get client(): RedisClient {
        return this._redisManager.client;
    }
}
