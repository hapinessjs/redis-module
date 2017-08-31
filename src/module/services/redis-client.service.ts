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

    /**
     *
     * @param key The key to lock
     * @param ttl The time before redis delete the key (default value 1000)
     * @param unit PX means the ttl was given in Seconds and MX means it was given in Milliseconds (default value is PX)
     *
     * Will set the key with the ttl only if it does not exists yet
     */
    public lock(key: string, ttl: number = 1000, unit: string = 'PX'): Observable<boolean> {
        const _unit = ['PX', 'MX'].indexOf(unit) > -1 ? unit : 'PX';
        return this._client.set(key, ttl.toString(), _unit, ttl, 'NX').map(_ => _ === 'OK');
    }

    /**
     *
     * @param key The key to delete in Redis
     *
     * Redis will give the number of deleted element and we'll return a boolean saying
     * TRUE if something has been deleted
     * FALSE if nothing has been deleted
     *
     */
    public unlock(key: string): Observable<boolean> {
        return this._client.del(key).map(_ => _ > 0);
    }

    /**
     *
     * @param key The key to check the lock
     *
     * Return true if there is a lock on the key else it will return false
     */
    public isLocked(key: string): Observable<boolean> {
        const ttl$ = this._client.ttl(key).map(ttl => Number(ttl));
        return Observable.merge(
                ttl$.filter(ttl => ttl === -1).switchMap(_ => this.unlock(key)).map(_ => false),
                ttl$.filter(ttl => ttl !== -1).map(ttl => ttl >= 0)
            );
    }
}
