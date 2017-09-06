import * as unit from 'unit.js';

import { test, suite } from 'mocha-typescript';
import { Observable } from 'rxjs/Observable';

import { RedisClientManager, RedisClientService } from '../../src';
import { FakeRedisClient, mockRedisCreateConnection } from '../mocks';

@suite('- Unit RedisClientServiceTest file')
class RedisClientServiceTest {

    @test('- Create the service and get the connection')
    testCreateServiceAndGetConnection(done) {
        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>new FakeRedisClient());

        const manager = new RedisClientManager(
            {
                url: '//toto',
                password: 'pass_redis',
                db: '2'
            }
        );

        const service = new RedisClientService(manager);

        service
            .connection
            .get('param')
            .subscribe(
                res => {
                    unit.string(res).is('param');
                    redisStub.restore();
                    done();
                },
                err => done(err)
            );
    }
}
