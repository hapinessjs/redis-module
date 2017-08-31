import * as unit from 'unit.js';

import { test, suite } from 'mocha-typescript';
import { Observable } from 'rxjs/Observable';
import { Callback, RedisClient } from 'redis';

import { RedisClientManager } from '../../src';
import { mockRedisCreateConnection } from '../mocks';

@suite('- Unit RedisClientManagerTest file')
class RedisClientManagerTest {

    @test('- Create the manager')
    testCreateManager(done) {
        class FakeRedisClient {
            get(param: string, cb: Callback<string>) {
                cb(null, param);
                return true;
            }
        }

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>new FakeRedisClient());

        const manager = new RedisClientManager(
            {
                url: '//toto',
                password: 'pass_redis',
                db: '2'
            }
        );

        manager.client.get('param', (err, res) => {
            unit.string(res).is('param');
            redisStub.restore();
            done();
        });
    }
}
