import * as unit from 'unit.js';
import * as redis from 'redis';

export function mockRedisCreateConnection() {
    return unit.stub(redis, 'createClient');
}

export class FakeRedisClient {
    get(param: string, cb: redis.Callback<string>) {
        cb(null, param);
        return true;
    }
}
