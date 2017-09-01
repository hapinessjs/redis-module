import * as redis_commands from 'redis-commands';

import { Injectable, Inject } from '@hapiness/core';

import { HapinessRedisClient } from '../../custom-typings/redis-types';
import { Observable } from 'rxjs';
import { RedisClient } from 'redis';

import { RedisExt } from '../redis.extension';

import { RedisConfig } from '../interfaces';
import { RedisClientManager } from '../managers';


@Injectable()
export class RedisClientService {

    private _client: HapinessRedisClient;

    constructor(@Inject(RedisExt) private _redisManager: RedisClientManager) {
        this._client = <any> _redisManager.client;
        redis_commands
            .list
            .forEach(command => {
                if (typeof this._redisManager.client[command] === 'function') {
                    this._client[command] = Observable.bindNodeCallback(this._client[command]);
                }
            });
    }

    /**
     * Return the HapinessRedisClient
     * You can call all existing redis function on it
     * See documentation at <https://redis.io/commands>
     */
    public get connection(): HapinessRedisClient {
        return this._client;
    }
}
