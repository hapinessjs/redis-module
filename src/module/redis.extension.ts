import { CoreModule, Extension, ExtensionWithConfig, OnExtensionLoad, ExtensionShutdownPriority, OnShutdown } from '@hapiness/core';

import { Observable } from 'rxjs/Observable';

import { RedisConfig } from './interfaces';
import { RedisClientManager } from './managers';

export class RedisExt implements OnExtensionLoad, OnShutdown {

    public static setConfig(config: RedisConfig): ExtensionWithConfig {
        return {
            token: RedisExt,
            config
        };
    }

    /**
     * Initilization of the extension
     * Create the manager instance
     *
     * @param  {CoreModule} module
     * @param  {RedisConfig} config
     *
     * @returns Observable
     */
    onExtensionLoad(module: CoreModule, config: RedisConfig): Observable<Extension> {
        return Observable
            .of(new RedisClientManager(config))
            .switchMap(redisClient => redisClient.createClient().map(() => redisClient))
            .map(redisClient => ({
                instance: this,
                token: RedisExt,
                value: redisClient
            }));
    }

    onShutdown(module, redisClient: RedisClientManager) {
        return {
            priority: ExtensionShutdownPriority.NORMAL,
            resolver: Observable.bindNodeCallback(redisClient.client.quit)()
        };
    }
}
