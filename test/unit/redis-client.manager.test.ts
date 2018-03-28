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
            .flatMap(() => manager.clientObs.setex('param', 60, 'xaxa'))
            .catch(err => {
                unit.object(err).isInstanceOf(Error).hasProperty('message', 'Cannot SETEX');
                return Observable.of(null);
            })
            .subscribe(
                _ => {
                    unit.bool(manager.clientObs.connected).isTrue();
                    manager.client.get('param', (err, res) => {
                        unit.string(res).is('param');
                        redisStub.restore();
                        done();
                    });
                },
                err => {
                    redisStub.restore();
                    done(err)
                });
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
                _ => {
                    redisStub.restore();
                    done(new Error('Should not be there'));
                },
                err => {
                    redisStub.restore();
                    unit.string(err.message).is('Thrown by fakeInst');
                    done();
                }
            );
    }
}
