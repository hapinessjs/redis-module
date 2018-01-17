import * as unit from 'unit.js';
import * as redis from 'redis';
import { EventEmitter } from 'events';

export function mockRedisCreateConnection() {
    return unit.stub(redis, 'createClient');
}

export class FakeRedisClient extends EventEmitter {
    get(param: string, cb: redis.Callback<string>) {
        cb(null, param);
        return true;
    }
}
