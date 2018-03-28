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


        let redisService: RedisClientService;
        Observable.of(manager)
            .flatMap(_ => _.createClient().map(__ => _))
            .map(client => new RedisClientService(<any> client))
            .do(_ => redisService = _)
            .flatMap(() => redisService.connection.get('param'))
            .do(res => unit.string(res).is('param'))
            .flatMap(() => Observable.bindNodeCallback(redisService.client.get)('param'))
            .do(res => unit.string(res).is('param'))
            .subscribe(
                res => {
                    redisStub.restore();
                    done();
                },
                err => {
                    redisStub.restore();
                    done(err);
                });
    }
}
