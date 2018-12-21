import { ClientOpts } from 'redis';

export interface RedisConfig extends ClientOpts {
    reconnect_interval?: number;
    ping_keepalive_interval?: number; // In seconds
    command_timeout?: number;
}
