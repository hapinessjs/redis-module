import { createClient, RedisClient } from 'redis';

import * as redis_commands from 'redis-commands';

import * as EventEmitter from 'events';

import { Observable } from 'rxjs';
import { URL } from 'url';

import { RedisConfig } from '../interfaces';
import { DefaultValues } from '../common';
import { HapinessRedisClient } from '../../custom-typings/redis-types';

const ClientProperties = [
    // redis properties, forwarded read-only.
    'connection_id',
    'connected',
    'ready',
    'connections',
    'options',
    'pub_sub_mode',
    'selected_db'
];

const ConnectionEvents = [
    'ready',
    'connect',
    'reconnecting',
    'error',
    'end'
];

const MonitorEvents = [
    'monitor'
];

const PubSubEvents = [
    'message',
    'pmessage',
    'subscribe',
    'psubscribe',
    'unsubscribe',
    'punsubscribe'
];

const AllEvents = [
    ...ConnectionEvents,
    ...MonitorEvents,
    ...PubSubEvents
];

export class RedisClientManager {

    private _config: any;
    private _client: RedisClient;
    private _redisClientObs: HapinessRedisClient;

    constructor(config: RedisConfig) {
        // If no retry strategy provided, we'll use the default one
        config.retry_strategy =
            config.retry_strategy || DefaultValues.RETRY_STRATEGY(config.reconnect_interval);

        // Removed unused properties by RedisConfig
        delete config.reconnect_interval;

        if (config.url && config.url.match(/^rediss/) && !config.tls) {
            config.tls = { servername: new URL(config.url).hostname };
        }

        // Create the redis client
        this._config = config;
    }

    public createClient() {
        return Observable.create(
            observer => {
                this._client = createClient(this._config);
                this.createObservableClient();
                this._redisClientObs.on('ready', () => {
                    observer.next();
                    observer.complete();
                });
                this._redisClientObs.on('error', err => {
                    observer.error(err);
                });
            }
        );
    }

    createObservableClient() {
        const redisClientObs: any = new EventEmitter();
        const sendCommand = this.sendCommand.bind(this);
        const client = this._client;

        redis_commands
            .list.forEach(command => {
                Object.defineProperty(redisClientObs, command, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value(...args) {
                        return sendCommand(command, ...args)
                    }
                });
            });

        AllEvents.forEach((eventName) => {
            this._client.on(eventName, redisClientObs.emit.bind(redisClientObs, eventName))
        }, this);

        ClientProperties.forEach((propertyName) => {
            Object.defineProperty(redisClientObs, propertyName, {
              configurable: true,
              enumerable: false,
              get() {
                return client[propertyName]
              }
            })
          });

        this._redisClientObs = redisClientObs;
    }

    sendCommand(command, ...args): Observable<any> {
        return Observable.create(observer => {
            this._client.send_command(command, args, (err, res) => {
                if (err) {
                    observer.error(err);
                } else {
                    observer.next(res);
                    observer.complete();
                }
            });
        });
    }

    public get client(): RedisClient {
        return this._client;
    }

    public get clientObs(): HapinessRedisClient {
        return this._redisClientObs;
    }
}
