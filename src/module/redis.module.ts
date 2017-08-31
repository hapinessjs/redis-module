import { HapinessModule } from '@hapiness/core';
import { RedisClientService } from './services';

@HapinessModule({
    version: '1.0.0-beta.1',
    declarations: [],
    providers: [],
    exports: [RedisClientService]
})
export class RedisModule {}
