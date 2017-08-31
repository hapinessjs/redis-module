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

    @test('- Calling lock without unit should use PX')
    testCallingLockWithoutUnitUsePx(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'set').returns(Observable.of('OK'));

        service
            .lock('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isTrue();
                    unit.string(stub.getCall(0).args[0]).is('mykey');
                    unit.string(stub.getCall(0).args[1]).is('1000');
                    unit.string(stub.getCall(0).args[2]).is('PX');
                    unit.number(stub.getCall(0).args[3]).is(1000);
                    unit.string(stub.getCall(0).args[4]).is('NX');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling lock with not allowed unit should use PX')
    testCallingLockWithNotAvailableUnitUsePx(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'set').returns(Observable.of('OK'));

        service
            .lock('mykey', 20, 'UNAVAILABLE')
            .subscribe(
                res => {
                    unit.bool(res).isTrue();
                    unit.string(stub.getCall(0).args[0]).is('mykey');
                    unit.string(stub.getCall(0).args[1]).is('20');
                    unit.string(stub.getCall(0).args[2]).is('PX');
                    unit.number(stub.getCall(0).args[3]).is(20);
                    unit.string(stub.getCall(0).args[4]).is('NX');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling unlock should return true if del return more than 0')
    testCallingUnlockShouldReturnTrue(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'del').returns(Observable.of(1));

        service
            .unlock('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isTrue();
                    unit.string(stub.getCall(0).args[0]).is('mykey');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling unlock should return false if del return less than 0 or equal 0')
    testCallingUnlockShouldReturnFalse(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'del').returns(Observable.of(0));

        service
            .unlock('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isFalse();
                    unit.string(stub.getCall(0).args[0]).is('mykey');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling isLocked should return false if del returns something less than 0 or equal to 0')
    testCallingIsLockedShouldReturnTrueIfTtlIsMoreThan0(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'ttl').returns(Observable.of('1'));

        service
            .isLocked('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isTrue();
                    unit.string(stub.getCall(0).args[0]).is('mykey');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling isLocked should return false if del returns -2')
    testCallingIsLockedShouldReturnFalseIfTtlIsMinus2(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const stub = unit.stub(service['_client'], 'ttl').returns(Observable.of('-2'));

        service
            .isLocked('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isFalse();
                    unit.string(stub.getCall(0).args[0]).is('mykey');

                    done();
                },
                err => done(err)
            );
    }

    @test('- Calling isLocked should return false if del returns -1')
    testCallingIsLockedShouldReturnFalseIfTtlIsMinus1(done) {
        const service = new RedisClientService(
            <any> { client: { set: () => {}, del: () => {}, ttl: () => {} } }
        );

        const clientStub = unit.stub(service['_client'], 'ttl').returns(Observable.of('-1'));
        const serviceStub = unit.stub(service, 'unlock').returns(Observable.of('OK'));

        service
            .isLocked('mykey')
            .subscribe(
                res => {
                    unit.bool(res).isFalse();

                    unit.string(clientStub.getCall(0).args[0]).is('mykey');
                    unit.string(serviceStub.getCall(0).args[0]).is('mykey');

                    done();
                },
                err => done(err)
            );
    }
}
