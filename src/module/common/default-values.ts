import { RetryStrategy, RetryStrategyOptions } from 'redis';

const debug = require('debug')('hapiness:redis');

export class DefaultValues {

    public static RECONNECT_INTERVAL = 5000;

    public static RETRY_STRATEGY(reconnect_interval?: number): RetryStrategy {
        return (opts: RetryStrategyOptions): number | Error => {
            debug('RETRY CONNECT');
            return reconnect_interval || DefaultValues.RECONNECT_INTERVAL
        };
    }

}
