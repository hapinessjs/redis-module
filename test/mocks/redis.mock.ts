import * as unit from 'unit.js';
import * as redis from 'redis';
import { EventEmitter } from 'events';

export function mockRedisCreateConnection() {
    return unit.stub(redis, 'createClient');
}

export class FakeRedisClient extends EventEmitter {
    public connected: boolean;

    constructor() {
        super();
        this.connected = true;
    }

    get(param: string, cb: redis.Callback<string>) {
        cb(null, param);
        return true;
    }

    setex(param: string, timer: number, value: string, cb) {
        cb(new Error('Cannot SETEX'), null);
        return false;
    }

    send_command(command, params, cb) {
        this[command].apply(this, [...params, cb]);
    }

    quit(cb: redis.Callback<void>) {
        cb(null, null);
        return true;
    }
}
