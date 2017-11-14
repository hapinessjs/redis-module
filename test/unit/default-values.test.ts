import * as unit from 'unit.js';

import { test, suite } from 'mocha-typescript';

import { DefaultValues } from '../../src';

@suite('- CommonValuesTest')
export class CommonValuesTest {

    @test('- Test of the RETRY_STRATEGY function')
    testCommonRetryStrategyFunction() {
        unit.number(DefaultValues.RETRY_STRATEGY()(null)).is(5000);
        unit.number(DefaultValues.RETRY_STRATEGY(null)(null)).is(5000);
        unit.number(DefaultValues.RETRY_STRATEGY(undefined)(null)).is(5000);
        unit.number(DefaultValues.RETRY_STRATEGY(10)(null)).is(10);
    }

}
