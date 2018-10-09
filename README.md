<img src="http://bit.ly/2mxmKKI" width="500" alt="Hapiness" />

<div style="margin-bottom:20px;">
<div style="line-height:60px">
    <a href="https://travis-ci.org/hapinessjs/redis-module.svg?branch=master">
        <img src="https://travis-ci.org/hapinessjs/redis-module.svg?branch=master" alt="build" />
    </a>
    <a href="https://coveralls.io/github/hapinessjs/redis-module?branch=master">
        <img src="https://coveralls.io/repos/github/hapinessjs/redis-module/badge.svg?branch=master" alt="coveralls" />
    </a>
    <a href="https://david-dm.org/hapinessjs/redis-module">
        <img src="https://david-dm.org/hapinessjs/redis-module.svg" alt="dependencies" />
    </a>
    <a href="https://david-dm.org/hapinessjs/redis-module?type=dev">
        <img src="https://david-dm.org/hapinessjs/redis-module/dev-status.svg" alt="devDependencies" />
    </a>
</div>
<div>
    <a href="https://www.typescriptlang.org/docs/tutorial.html">
        <img src="https://cdn-images-1.medium.com/max/800/1*8lKzkDJVWuVbqumysxMRYw.png"
             align="right" alt="Typescript logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://reactivex.io/rxjs">
        <img src="http://reactivex.io/assets/Rx_Logo_S.png"
             align="right" alt="ReactiveX logo" width="50" height="50" style="border:none;" />
    </a>
    <a href="http://hapijs.com">
        <img src="http://bit.ly/2lYPYPw"
             align="right" alt="Hapijs logo" width="75" style="border:none;" />
    </a>
</div>
</div>

# Redis Module

```Redis``` module for the Hapiness framework.

## Table of contents


* [Using your module inside Hapiness application](#using-your-module-inside-hapiness-application)
	* [`yarn` or `npm` it in your `package.json`](#yarn-or-npm-it-in-your-package)
	* [Importing `RedisModule` from the library](#importing-redismodule-from-the-library)
	* [Using `Redis` inside your application](#using-redis-inside-your-application)
* [```RedisClientService``` functions](#redisclientservice-functions)

## Using your module inside Hapiness application


### `yarn` or `npm` it in your `package.json`

```bash
$ npm install --save @hapiness/core @hapiness/redis rxjs

or

$ yarn add @hapiness/core @hapiness/redis rxjs
```

```javascript
"dependencies": {
    "@hapiness/core": "^1.3.0",
    "@hapiness/redis": "^1.0.1",
    "rxjs": "^5.5.5",
    //...
}
//...
```


### Importing `RedisModule` from the library

This module provide an Hapiness extension for Redis.
To use it, simply register it during the ```bootstrap``` step of your project and provide the ```RedisExt``` with its config

```javascript

@HapinessModule({
    version: '1.0.0',
    providers: [],
    declarations: [],
    imports: [RedisModule]
})
class MyApp implements OnStart {
    constructor() {}
    onStart() {}
}

Hapiness
    .bootstrap(
        MyApp,
        [
            /* ... */
            RedisExt.setConfig(
                {
                    url: '//redis_url:6379',
                    password: 'password',
                    db: '1'
                    /* ... Other options ... */
                }
            )
        ]
    )
    .catch(err => {
        /* ... */
    });

```

```RedisExt``` needs a ```ClientOpts``` object so you can provide all the properties defined in the interface (see below)

```
export interface ClientOpts {

    host?: string;
    port?: number;
    path?: string;
    url?: string;
    parser?: string;
    string_numbers?: boolean;
    return_buffers?: boolean;
    detect_buffers?: boolean;
    socket_keepalive?: boolean;
    no_ready_check?: boolean;
    enable_offline_queue?: boolean;
    retry_max_delay?: number;
    connect_timeout?: number;
    max_attempts?: number;
    retry_unfulfilled_commands?: boolean;
    auth_pass?: string;
    password?: string;
    db?: string;
    family?: string;
    rename_commands?: { [command: string]: string };
    tls?: any;
    prefix?: string;
    retry_strategy?: RetryStrategy;
    ping_keepalive_interval?: number: // In seconds
}

```


### Using `Redis` inside your application

To use redis, you need to inject inside your providers the ```RedisClientService```.

```javascript

class FooProvider {

    constructor(private _redis: RedisClientService) {}

    bar(): Observable<string> {
    	return this._redis.connection.get('my_key');
    }

}

```


## ```RedisClientService``` functions

```RedisClientService.connection``` this will return you the redis client and you will be able to call on it every redis command (see the list of commands [here](https://redis.io/commands))

**INFO** All function returns RxJS Observable

[Back to top](#table-of-contents)

## Maintainers

<table>
    <tr>
        <td colspan="4" align="center"><a href="https://www.tadaweb.com"><img src="http://bit.ly/2xHQkTi" width="117" alt="tadaweb" /></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil"><img src="https://avatars3.githubusercontent.com/u/6546204?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/antoinegomez"><img src="https://avatars3.githubusercontent.com/u/997028?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/reptilbud"><img src="https://avatars3.githubusercontent.com/u/6841511?v=3&s=117" width="117"/></a></td>
        <td align="center"><a href="https://github.com/njl07"><img src="https://avatars3.githubusercontent.com/u/1673977?v=3&s=117" width="117"/></a></td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Juneil">Julien Fauville</a></td>
        <td align="center"><a href="https://github.com/antoinegomez">Antoine Gomez</a></td>
        <td align="center"><a href="https://github.com/reptilbud">Sébastien Ritz</a></td>
        <td align="center"><a href="https://github.com/njl07">Nicolas Jessel</a></td>
    </tr>
</table>

[Back to top](#table-of-contents)

## License

Copyright (c) 2017 **Hapiness** Licensed under the [MIT license](https://github.com/hapinessjs/redis-module/blob/master/LICENSE.md).

[Back to top](#table-of-contents)
