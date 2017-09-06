import { ClientOpts } from 'redis';

export interface RedisConfig extends ClientOpts {
    reconnect_interval?: number;
}
