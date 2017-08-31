
/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite, only } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { extractMetadata } from '@hapiness/core/core';
import { Hapiness, HapinessModule, OnStart, Inject } from '@hapiness/core';
import { HttpServerExt, Server } from '@hapiness/core/extensions/http-server';

import { Observable } from 'rxjs/Observable';

// Mongoose mocking
import { FakeRedisClient, mockRedisCreateConnection } from '../mocks';

// element to test
import { RedisExt, RedisModule, RedisClientService } from '../../src';

@suite('- Integration tests of RedisModule')
class RedisModuleIntegrationTest {
    /**
     * Function executed before the suite
     */
    static before() { }

    /**
     * Function executed after the suite
     */
    static after() { }

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() { }

    /**
     * Function executed before each test
     */
    before() {}

    /**
     * Function executed after each test
     */
    after() {}

    /**
     * Test if `RedisModule` is correctly integrated and has functions
     */
    @test('- Test if `RedisModule` is correctly integrated and has functions')
    testRedisModule(done) {
        const redisStub = mockRedisCreateConnection();
        redisStub.returns(<any>new FakeRedisClient());

        @HapinessModule({
            version: '1.0.0',
            providers: [],
            imports: [RedisModule]
        })
        class RedisModuleTest implements OnStart {
            constructor(
                @Inject(HttpServerExt) private _httpServer: Server,
                private _redisClient: RedisClientService
            ) {}

            onStart(): void {
                this
                    ._redisClient
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

        Hapiness.bootstrap(RedisModuleTest, [
            HttpServerExt.setConfig({ host: '0.0.0.0', port: 1234 }),
            RedisExt.setConfig(
                {
                    url: '//tdw01.dev01.in.tdw:6379',
                    password: 't4d4r3d1s',
                    db: '1'
                }
            )
        ]);
    }
}
