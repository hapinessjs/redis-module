pretest:
	@node ./node_modules/.bin/tslint -p ./tsconfig.json "./src/**/*.ts" "./test/**/*.ts" -e "./src/custom-typings/**/*.ts"
test:
	@node ./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha "./test/**/*.ts"
coveralls:
	cat ./coverage/lcov.info | node ./node_modules/.bin/coveralls
tsc:
	@node ./node_modules/.bin/tsc -p ./tsconfig.build.json
clean:
	@node ./node_modules/.bin/rimraf ./dist
packaging:
	@node ./node_modules/.bin/ts-node ./tools/packaging.ts

.PHONY: pretest test test-on-travis tsc clean packaging