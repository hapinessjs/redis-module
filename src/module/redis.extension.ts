import { CoreModule, Extension, ExtensionWithConfig, OnExtensionLoad } from '@hapiness/core';

import { Observable } from 'rxjs/Observable';

import { RedisConfig } from './interfaces';
import { RedisClientManager } from './managers';

export class RedisExt implements OnExtensionLoad {

    public static setConfig(config: RedisConfig): ExtensionWithConfig {
        return {
            token: RedisExt,
            config
        };
    }

    /**
     * Initilization of the extension
     * Create the socket server
     *
     * @param  {CoreModule} module
     * @param  {SocketConfig} config
     * @returns Observable
     */
    onExtensionLoad(module: CoreModule, config: RedisConfig): Observable<Extension> {
        return Observable
            .of(new RedisClientManager(config))
            .map(_ => ({
                instance: this,
                token: RedisExt,
                value: _
            }));
    }
}
