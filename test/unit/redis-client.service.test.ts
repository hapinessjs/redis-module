import * as unit from 'unit.js';

import { test, suite } from 'mocha-typescript';
import { Observable } from 'rxjs';

import { RedisClientManager, RedisClientService } from '../../src';
import { FakeRedisClient, mockRedisCreateConnection } from '../mocks';

@suite('- Unit RedisClientServiceTest file')
export class RedisClientServiceTest {

    @test('- Create the service and get the connection')
    testCreateServiceAndGetConnection(done) {
        const fakeInst = new FakeRedisClient();

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>fakeInst);

        const manager = new RedisClientManager(
            {
                url: '//toto',
                password: 'pass_redis',
                db: '2'
            }
        );

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => _.emit('ready'))
            .subscribe();


        Observable.of(manager)
            .flatMap(_ => _.createClient().map(__ => _))
            .map(_ => new RedisClientService(<any> _))
            .flatMap(_ => _.connection.get('param'))
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
