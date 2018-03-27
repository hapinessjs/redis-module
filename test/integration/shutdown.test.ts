import { test, suite } from 'mocha-typescript';

import { Observable } from 'rxjs';

import { Hapiness, HapinessModule, OnStart } from '@hapiness/core';

import { FakeRedisClient, mockRedisCreateConnection } from '../mocks';
import { RedisExt, RedisModule } from '../../src';

@suite('- Integration tests of RedisModule')
export class RedisModuleIntegrationTest {

    @test('- Test shutdown')
    testRedisModule(done) {
        const fakeInst = new FakeRedisClient();
        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any> fakeInst);

        Observable
            .of(fakeInst)
            .delay(new Date(Date.now() + 1500))
            .map(_ => _.emit('ready'))
            .subscribe();

        @HapinessModule({
            version: '1.0.0',
            providers: [],
            imports: [RedisModule]
        })
        class RedisShutdownTest implements OnStart {
            constructor() {}

            onStart(): void {
                const extension = Hapiness['extensions'].find(item => item.token === RedisExt);
                extension.instance.onShutdown(<any>{}, extension.value).resolver
                    .do(() => {
                        redisStub.restore();
                    })
                    .subscribe(() => done(), err => done(err));
            }
        }

        Hapiness.bootstrap(RedisShutdownTest, [
            RedisExt.setConfig(
                {
                    url: '//test.com',
                    password: 'mdp',
                    db: '1'
                }
            )
        ]);
    }
}
