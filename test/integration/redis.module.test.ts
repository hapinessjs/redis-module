/**
 * @see https://github.com/pana-cc/mocha-typescript
 */
import { test, suite } from 'mocha-typescript';

/**
 * @see http://unitjs.com/
 */
import * as unit from 'unit.js';

import { Hapiness, HapinessModule, Inject, OnStart, Server } from '@hapiness/core';
import { HttpServerExt } from '@hapiness/core/extensions/http-server';

// Mongoose mocking
import { FakeRedisClient, mockRedisCreateConnection } from '../mocks';

// element to test
import { RedisExt, RedisModule, RedisClientService } from '../../src';

@suite('- Integration tests of RedisModule')
export class RedisModuleIntegrationTest {
    /**
     * Function executed before the suite
     */
    static before() {
    }

    /**
     * Function executed after the suite
     */
    static after() {
    }

    /**
     * Class constructor
     * New lifecycle
     */
    constructor() {
    }

    /**
     * Function executed before each test
     */
    before() {
    }

    /**
     * Function executed after each test
     */
    after() {
    }

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
            constructor(@Inject(HttpServerExt) private _httpServer: Server,
                        private _redisClient: RedisClientService) {
            }

            onStart(): void {
                this
                    ._redisClient
                    .connection
                    .get('param')
                    .subscribe(
                        res => {
                            unit.string(res).is('param');
                            redisStub.restore();
                            this
                                ._httpServer
                                .stop()
                                .then(__ => done())
                                .catch(err => done(err))
                        },
                        err => this
                            ._httpServer
                            .stop()
                            .then(__ => done(err))
                            .catch(e => done(e))
                    );
            }
        }

        Hapiness.bootstrap(RedisModuleTest, [
            HttpServerExt.setConfig({ host: '0.0.0.0', port: 1234 }),
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
