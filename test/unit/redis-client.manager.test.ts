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

    @test('- Test url with rediss:// as protocol creates tls object')
    testUrlRediss(done) {
        const fakeInst = new FakeRedisClient();

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => fakeInst.emit('ready'))
            .subscribe();

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>fakeInst);

        const manager = new RedisClientManager(
            {
                url: 'rediss://:pass_redis@toto',
                db: 1
            }
        );

        manager
            .createClient()
            .subscribe(
                _ => {
                    redisStub.restore();
                    unit.object(redisStub.firstCall);
                    unit.array(redisStub.firstCall.args);
                    unit.object(redisStub.firstCall.args[0].tls).is({
                        servername: 'toto'
                    });
                    done();
                },
                err => {
                    redisStub.restore();
                    done(new Error('Should not be there'));
                }
            );
    }

    @test('- Test url with rediss:// as protocol do not create tls object if already provided')
    testUrlRedissTls(done) {
        const fakeInst = new FakeRedisClient();

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => fakeInst.emit('ready'))
            .subscribe();

        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>fakeInst);

        const manager = new RedisClientManager(
            {
                url: 'rediss://:pass_redis@toto',
                db: 1,
                tls: {
                    servername: 'toto2'
                }
            }
        );

        manager
            .createClient()
            .subscribe(
                _ => {
                    redisStub.restore();
                    unit.object(redisStub.firstCall);
                    unit.array(redisStub.firstCall.args);
                    unit.object(redisStub.firstCall.args[0].tls).is({
                        servername: 'toto2'
                    });
                    done();
                },
                err => {
                    redisStub.restore();
                    done(new Error('Should not be there'));
                }
            );
    }

    // @test.only('- ')
    // test(done) {
    //     const fakeInst = new FakeRedisClient();

    //     const redisStub = mockRedisCreateConnection();
    //     redisStub.returns(<any>fakeInst);

    //     Observable
    //         .of(fakeInst)
    //         .delay(new Date(Date.now() + 1500))
    //         .map(_ => fakeInst.emit('ready'))
    //         .subscribe();

    //     const manager = new RedisClientManager(
    //         {
    //             url: '//toto',
    //             password: 'pass_redis',
    //             db: '2'
    //         }
    //     );

    //     manager.createClient().flatMap(_ => manager.sendCommand('get', []))
    //         .subscribe(_ => { console.log('NEXT'); done() }, e => { console.log(e); done(e) });
    // }
}
