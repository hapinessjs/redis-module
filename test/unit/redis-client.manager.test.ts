import * as unit from 'unit.js';

import { test, suite } from 'mocha-typescript';

import { RedisClientManager } from '../../src';
import { mockRedisCreateConnection, FakeRedisClient } from '../mocks';
import { Observable } from 'rxjs/Observable';

@suite('- Unit RedisClientManagerTest file')
export class RedisClientManagerTest {

    @test('- Create the manager')
    testCreateManager(done) {
        const fakeInst = new FakeRedisClient();

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>fakeInst);

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => fakeInst.emit('ready'))
            .subscribe();

        const manager = new RedisClientManager(
            {
                url: '//toto',
                password: 'pass_redis',
                db: '2'
            }
        );

        manager
            .createClient()
            .subscribe(
                _ => {
                    manager.client.get('param', (err, res) => {
                        unit.string(res).is('param');
                        redisStub.restore();
                        done();
                    });
                },
                err => done(err)
            );
    }

    @test('- Dont create the manager and return error')
    testCreateManagerError(done) {
        const fakeInst = new FakeRedisClient();

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>fakeInst);

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => fakeInst.emit('error', new Error('Thrown by fakeInst')))
            .subscribe();

        const manager = new RedisClientManager(
            {
                url: '//toto',
                password: 'pass_redis',
                db: '2'
            }
        );

        manager
            .createClient()
            .subscribe(
                _ => done(new Error('Should not be there')),
                err => {
                    unit.string(err.message).is('Thrown by fakeInst');
                    redisStub.restore();
                    done();
                }
            );
    }
}
