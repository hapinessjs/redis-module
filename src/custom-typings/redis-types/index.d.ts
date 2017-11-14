// Type definitions for redis 2.6.0
// Project: https://github.com/mranney/node_redis
//
// Definitions by:
//  - Carlos Ballesteros Velasco <https://github.com/soywiz>,
//  - Peter Harris <https://github.com/CodeAnimal>,
//  - TANAKA Koichi <https://github.com/MugeSo>
//
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Imported from: https://github.com/types/npm-redis

/// <reference types="node" />

import { EventEmitter } from 'events';
import { Duplex } from 'stream';
import { Observable } from 'rxjs/Observable';

export interface RetryStrategyOptions {
    error: Error;
    total_retry_time: number;
    times_connected: number;
    attempt: number;
}

export interface RetryStrategy {
    (options: RetryStrategyOptions): number | Error;
}

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
}

export interface Callback<T> {
    (err: Error | null, reply: T): void;
}

export interface ServerInfo {
    redis_version: string;
    versions: number[];
}

export interface OverloadedCommand<T, U, R> {
    (args: T[]): Observable<U>;
    (arg: T, args: T[]): Observable<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T, arg4: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T): Observable<U>;
    (arg1: T, arg2: T): Observable<U>;
    (arg1: T): Observable<U>;
}

export interface OverloadedKeyCommand<T, U, R> {
    (key: string, args: T[]): Observable<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T): Observable<U>;
    (key: string, arg1: T, arg2: T): Observable<U>;
    (key: string, arg1: T): Observable<U>;
    (key: string, ...args: (T | Callback<U>)[]): R;
    (...args: (string | T | Callback<U>)[]): R;
}

export interface OverloadedListCommand<T, U, R> {
    (args: T[]): Observable<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T, arg4: T): Observable<U>;
    (arg1: T, arg2: T, arg3: T): Observable<U>;
    (arg1: T, arg2: T): Observable<U>;
    (arg1: T): Observable<U>;
    (...args: (T | Callback<U>)[]): R;
}

export interface OverloadedSetCommand<T, U, R> {
    (key: string, args: { [key: string]: T } | T[]): Observable<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Observable<U>;
    (key: string, arg1: T, arg2: T, arg3: T): Observable<U>;
    (key: string, arg1: T, arg2: T): Observable<U>;
    (key: string, arg1: T): Observable<U>;
    (key: string, ...args: (T | Callback<U>)[]): R;
}

export interface OverloadedLastCommand<T1, T2, U, R> {
    (args: (T1 | T2)[]): Observable<U>;
    (arg: T1, args: (T1 | T2)[]): Observable<U>;

    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, arg6: T2): Observable<U>;
    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T2): Observable<U>;
    (arg1: T1, arg2: T1, arg3: T1, arg4: T2): Observable<U>;
    (arg1: T1, arg2: T1, arg3: T2): Observable<U>;
    (arg1: T1, arg2: T2): Observable<U>;
    (...args: (T1 | T2 | Callback<U>)[]): R;
}

export interface Commands<R> {
    /**
     * Listen for all requests received by the server in real time.
     */
    monitor(): Observable<undefined>;
    MONITOR(): Observable<undefined>;

    /**
     * Get information and statistics about the server.
     */
    info(): Observable<ServerInfo>;
    info(section?: string | string[]): Observable<ServerInfo>;
    INFO(): Observable<ServerInfo>;
    INFO(section?: string | string[]): Observable<ServerInfo>;

    /**
     * Ping the server.
     */
    ing(): Observable<string>;
    ping(message: string): Observable<string>;

    /**
     * Post a message to a channel.
     */
    publish(channel: string, value: string): Observable<number>;

    /**
     * Authenticate to the server.
     */
    auth(password: string): Observable<string>;
    AUTH(password: string): Observable<string>;

    /**
     * KILL - Kill the connection of a client.
     * LIST - Get the list of client connections.
     * GETNAME - Get the current connection name.
     * PAUSE - Stop processing commands from clients for some time.
     * REPLY - Instruct the server whether to reply to commands.
     * SETNAME - Set the current connection name.
     */
    client: OverloadedCommand<string, any, R>;
    CLIENT: OverloadedCommand<string, any, R>;

    /**
     * Set multiple hash fields to multiple values.
     */
    hmset: OverloadedSetCommand<string | number, boolean, R>;
    HMSET: OverloadedSetCommand<string | number, boolean, R>;

    /**
     * Listen for messages published to the given channels.
     */
    subscribe: OverloadedListCommand<string, string, R>;
    SUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Stop listening for messages posted to the given channels.
     */
    unsubscribe: OverloadedListCommand<string, string, R>;
    UNSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Listen for messages published to channels matching the given patterns.
     */
    psubscribe: OverloadedListCommand<string, string, R>;
    PSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Stop listening for messages posted to channels matching the given patterns.
     */
    punsubscribe: OverloadedListCommand<string, string, R>;
    PUNSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Append a value to a key.
     */
    append(key: string, value: string): Observable<number>;
    APPEND(key: string, value: string): Observable<number>;

    /**
     * Asynchronously rewrite the append-only file.
     */
    bgrewriteaof(): Observable<'OK'>;
    BGREWRITEAOF(): Observable<'OK'>;

    /**
     * Asynchronously save the dataset to disk.
     */
    bgsave(): Observable<string>;
    BGSAVE(): Observable<string>;

    /**
     * Count set bits in a string.
     */
    bitcount(key: string): Observable<number>;
    bitcount(key: string, start: number, end: number): Observable<number>;
    BITCOUNT(key: string): Observable<number>;
    BITCOUNT(key: string, start: number, end: number): Observable<number>;

    /**
     * Perform arbitrary bitfield integer operations on strings.
     */
    bitfield: OverloadedKeyCommand<string | number, [number, number], R>;
    BITFIELD: OverloadedKeyCommand<string | number, [number, number], R>;

    /**
     * Perform bitwise operations between strings.
     */
    bitop(operation: string, destkey: string, key1: string, key2: string, key3: string): Observable<number>;
    bitop(operation: string, destkey: string, key1: string, key2: string): Observable<number>;
    bitop(operation: string, destkey: string, key: string): Observable<number>;
    bitop(operation: string, destkey: string, ...args: (string | Callback<number>)[]): R;
    BITOP(operation: string, destkey: string, key1: string, key2: string, key3: string): Observable<number>;
    BITOP(operation: string, destkey: string, key1: string, key2: string): Observable<number>;
    BITOP(operation: string, destkey: string, key: string): Observable<number>;
    BITOP(operation: string, destkey: string, ...args: string): Observable<any>;

    /**
     * Find first bit set or clear in a string.
     */
    bitpos(key: string, bit: number, start: number, end: number): Observable<number>;
    bitpos(key: string, bit: number, start: number): Observable<number>;
    bitpos(key: string, bit: number): Observable<number>;
    BITPOS(key: string, bit: number, start: number, end: number): Observable<number>;
    BITPOS(key: string, bit: number, start: number): Observable<number>;
    BITPOS(key: string, bit: number): Observable<number>;

    /**
     * Remove and get the first element in a list, or block until one is available.
     */
    blpop: OverloadedLastCommand<string, number, [string, string], R>;
    BLPOP: OverloadedLastCommand<string, number, [string, string], R>;

    /**
     * Remove and get the last element in a list, or block until one is available.
     */
    brpop: OverloadedLastCommand<string, number, [string, string], R>;
    BRPOP: OverloadedLastCommand<string, number, [string, string], R>;

    /**
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpush(source: string, destination: string, timeout: number): Observable<[string, string]>;
    BRPOPLPUSH(source: string, destination: string, timeout: number): Observable<[string, string]>;

    /**
     * ADDSLOTS - Assign new hash slots to receiving node.
     * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
     * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
     * DELSLOTS - Set hash slots as unbound in receiving node.
     * FAILOVER - Forces a slave to perform a manual failover of its master.
     * FORGET - Remove a node from the nodes table.
     * GETKEYSINSLOT - Return local key names in the specified hash slot.
     * INFO - Provides info about Redis Cluster node state.
     * KEYSLOT - Returns the hash slot of the specified key.
     * MEET - Force a node cluster to handshake with another node.
     * NODES - Get cluster config for the node.
     * REPLICATE - Reconfigure a node as a slave of the specified master node.
     * RESET - Reset a Redis Cluster node.
     * SAVECONFIG - Forces the node to save cluster state on disk.
     * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
     * SETSLOT - Bind a hash slot to a specified node.
     * SLAVES - List slave nodes of the specified master node.
     * SLOTS - Get array of Cluster slot to node mappings.
     */
    cluster: OverloadedCommand<string, any, this>;
    CLUSTER: OverloadedCommand<string, any, this>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    command(): Observable<Array<[string, number, string[], number, number, number]>>;
    COMMAND(): Observable<Array<[string, number, string[], number, number, number]>>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get array of Redis command details.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific Redis command details.
     * GET - Get the value of a configuration parameter.
     * REWRITE - Rewrite the configuration file with the in memory configuration.
     * SET - Set a configuration parameter to the given value.
     * RESETSTAT - Reset the stats returned by INFO.
     */
    config: OverloadedCommand<string, boolean, R>;
    CONFIG: OverloadedCommand<string, boolean, R>;

    /**
     * Return the number of keys in the selected database.
     */
    dbsize(): Observable<number>;
    DBSIZE(): Observable<number>;

    /**
     * OBJECT - Get debugging information about a key.
     * SEGFAULT - Make the server crash.
     */
    debug: OverloadedCommand<string, boolean, R>;
    DEBUG: OverloadedCommand<string, boolean, R>;

    /**
     * Decrement the integer value of a key by one.
     */
    decr(key: string): Observable<number>;
    DECR(key: string): Observable<number>;

    /**
     * Decrement the integer value of a key by the given number.
     */
    decrby(key: string, decrement: number): Observable<number>;
    DECRBY(key: string, decrement: number): Observable<number>;

    /**
     * Delete a key.
     */
    del: OverloadedCommand<string, number, R>;
    DEL: OverloadedCommand<string, number, R>;

    /**
     * Discard all commands issued after MULTI.
     */
    discard(): Observable<'OK'>;
    DISCARD(): Observable<'OK'>;

    /**
     * Return a serialized version of the value stored at the specified key.
     */
    dump(key: string): Observable<string>;
    DUMP(key: string): Observable<string>;

    /**
     * Echo the given string.
     */
    echo<T extends string>(message: T): Observable<T>;
    ECHO<T extends string>(message: T): Observable<T>;

    /**
     * Execute a Lua script server side.
     */
    eval: OverloadedCommand<string | number, any, R>;
    EVAL: OverloadedCommand<string | number, any, R>;

    /**
     * Execute a Lue script server side.
     */
    evalsha: OverloadedCommand<string | number, any, R>;
    EVALSHA: OverloadedCommand<string | number, any, R>;

    /**
     * Determine if a key exists.
     */
    exists: OverloadedCommand<string, number, R>;
    EXISTS: OverloadedCommand<string, number, R>;

    /**
     * Set a key's time to live in seconds.
     */
    expire(key: string, seconds: number): Observable<number>;
    EXPIRE(key: string, seconds: number): Observable<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp.
     */
    expireat(key: string, timestamp: number): Observable<number>;
    EXPIREAT(key: string, timestamp: number): Observable<number>;

    /**
     * Remove all keys from all databases.
     */
    flushall(): Observable<string>;
    FLUSHALL(): Observable<string>;

    /**
     * Remove all keys from the current database.
     */
    flushdb(): Observable<string>;
    FLUSHDB(): Observable<string>;

    /**
     * Add one or more geospatial items in the geospatial index represented using a sorted set.
     */
    geoadd: OverloadedKeyCommand<string | number, number, R>;
    GEOADD: OverloadedKeyCommand<string | number, number, R>;

    /**
     * Returns members of a geospatial index as standard geohash strings.
     */
    geohash: OverloadedKeyCommand<string, string, R>;
    GEOHASH: OverloadedKeyCommand<string, string, R>;

    /**
     * Returns longitude and latitude of members of a geospatial index.
     */
    geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>;
    GEOPOS: OverloadedKeyCommand<string, Array<[number, number]>, R>;

    /**
     * Returns the distance between two members of a geospatial index.
     */
    geodist: OverloadedKeyCommand<string, string, R>;
    GEODIST: OverloadedKeyCommand<string, string, R>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
     */
    georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
    GEORADIUS: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
     */
    georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
    GEORADIUSBYMEMBER: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

    /**
     * Get the value of a key.
     */
    get(key: string): Observable<R>;
    GET(key: string): Observable<R>;

    /**
     * Returns the bit value at offset in the string value stored at key.
     */
    getbit(key: string, offset: number): Observable<number>;
    GETBIT(key: string, offset: number): Observable<number>;

    /**
     * Get a substring of the string stored at a key.
     */
    getrange(key: string, start: number, end: number): Observable<string>;
    GETRANGE(key: string, start: number, end: number): Observable<string>;

    /**
     * Set the string value of a key and return its old value.
     */
    getset(key: string, value: string): Observable<string>;
    GETSET(key: string, value: string): Observable<string>;

    /**
     * Delete on or more hash fields.
     */
    hdel: OverloadedKeyCommand<string, number, R>;
    HDEL: OverloadedKeyCommand<string, number, R>;

    /**
     * Determine if a hash field exists.
     */
    hexists(key: string, field: string): Observable<number>;
    HEXISTS(key: string, field: string): Observable<number>;

    /**
     * Get the value of a hash field.
     */
    hget(key: string, field: string): Observable<string>;
    HGET(key: string, field: string): Observable<string>;

    /**
     * Get all fields and values in a hash.
     */
    hgetall(key: string): Observable<{ [key: string]: string }>;
    HGETALL(key: string): Observable<{ [key: string]: string }>;

    /**
     * Increment the integer value of a hash field by the given number.
     */
    hincrby(key: string, field: string, increment: number): Observable<number>;
    HINCRBY(key: string, field: string, increment: number): Observable<number>;

    /**
     * Increment the float value of a hash field by the given amount.
     */
    hincrbyfloat(key: string, field: string, increment: number): Observable<number>;
    HINCRBYFLOAT(key: string, field: string, increment: number): Observable<number>;

    /**
     * Get all the fields of a hash.
     */
    hkeys(key: string): Observable<string[]>;
    HKEYS(key: string): Observable<string[]>;

    /**
     * Get the number of fields in a hash.
     */
    hlen(key: string): Observable<number>;
    HLEN(key: string): Observable<number>;

    /**
     * Get the values of all the given hash fields.
     */
    hmget: OverloadedKeyCommand<string, string[], R>;
    HMGET: OverloadedKeyCommand<string, string[], R>;

    /**
     * Set the string value of a hash field.
     */
    hset(key: string, field: string, value: string): Observable<number>;
    HSET(key: string, field: string, value: string): Observable<number>;

    /**
     * Set the value of a hash field, only if the field does not exist.
     */
    hsetnx(key: string, field: string, value: string): Observable<number>;
    HSETNX(key: string, field: string, value: string): Observable<number>;

    /**
     * Get the length of the value of a hash field.
     */
    hstrlen(key: string, field: string): Observable<number>;
    HSTRLEN(key: string, field: string): Observable<number>;

    /**
     * Get all the values of a hash.
     */
    hvals(key: string): Observable<string[]>;
    HVALS(key: string): Observable<string[]>;

    /**
     * Increment the integer value of a key by one.
     */
    incr(key: string): Observable<string[]>;
    INCR(key: string): Observable<string[]>;

    /**
     * Increment the integer value of a key by the given amount.
     */
    incrby(key: string, increment: number): Observable<string[]>;
    INCRBY(key: string, increment: number): Observable<string[]>;

    /**
     * Increment the float value of a key by the given amount.
     */
    incrbyfloat(key: string, increment: number): Observable<string[]>;
    INCRBYFLOAT(key: string, increment: number): Observable<string[]>;

    /**
     * Find all keys matching the given pattern.
     */
    keys(pattern: string): Observable<string[]>;
    KEYS(pattern: string): Observable<string[]>;

    /**
     * Get the UNIX time stamp of the last successful save to disk.
     */
    lastsave(): Observable<number>;
    LASTSAVE(): Observable<number>;

    /**
     * Get an element from a list by its index.
     */
    lindex(key: string, index: number): Observable<string>;
    LINDEX(key: string, index: number): Observable<string>;

    /**
     * Insert an element before or after another element in a list.
     */
    linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Observable<string>;
    LINSERT(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Observable<string>;

    /**
     * Get the length of a list.
     */
    llen(key: string): Observable<number>;
    LLEN(key: string): Observable<number>;

    /**
     * Remove and get the first element in a list.
     */
    lpop(key: string): Observable<string>;
    LPOP(key: string): Observable<string>;

    /**
     * Prepend one or multiple values to a list.
     */
    lpush: OverloadedKeyCommand<string, number, R>;
    LPUSH: OverloadedKeyCommand<string, number, R>;

    /**
     * Prepend a value to a list, only if the list exists.
     */
    lpushx(key: string, value: string): Observable<number>;
    LPUSHX(key: string, value: string): Observable<number>;

    /**
     * Get a range of elements from a list.
     */
    lrange(key: string, start: number, stop: number): Observable<string[]>;
    LRANGE(key: string, start: number, stop: number): Observable<string[]>;

    /**
     * Remove elements from a list.
     */
    lrem(key: string, count: number, value: string): Observable<number>;
    LREM(key: string, count: number, value: string): Observable<number>;

    /**
     * Set the value of an element in a list by its index.
     */
    lset(key: string, index: number, value: string): Observable<'OK'>;
    LSET(key: string, index: number, value: string): Observable<'OK'>;

    /**
     * Trim a list to the specified range.
     */
    ltrim(key: string, start: number, stop: number): Observable<'OK'>;
    LTRIM(key: string, start: number, stop: number): Observable<'OK'>;

    /**
     * Get the values of all given keys.
     */
    mget: OverloadedCommand<string, string[], R>;
    MGET: OverloadedCommand<string, string[], R>;

    /**
     * Atomically tranfer a key from a Redis instance to another one.
     */
    migrate: OverloadedCommand<string, boolean, R>;
    MIGRATE: OverloadedCommand<string, boolean, R>;

    /**
     * Move a key to another database.
     */
    move(key: string, db: string | number): R;
    MOVE(key: string, db: string | number): R;

    /**
     * Set multiple keys to multiple values.
     */
    mset: OverloadedCommand<string, boolean, R>;
    MSET: OverloadedCommand<string, boolean, R>;

    /**
     * Set multiple keys to multiple values, only if none of the keys exist.
     */
    msetnx: OverloadedCommand<string, boolean, R>;
    MSETNX: OverloadedCommand<string, boolean, R>;

    /**
     * Inspect the internals of Redis objects.
     */
    object: OverloadedCommand<string, any, R>;
    OBJECT: OverloadedCommand<string, any, R>;

    /**
     * Remove the expiration from a key.
     */
    persist(key: string): Observable<number>;
    PERSIST(key: string): Observable<number>;

    /**
     * Remove a key's time to live in milliseconds.
     */
    pexpire(key: string, milliseconds: number): Observable<number>;
    PEXPIRE(key: string, milliseconds: number): Observable<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
     */
    pexpireat(key: string, millisecondsTimestamp: number): Observable<number>;
    PEXPIREAT(key: string, millisecondsTimestamp: number): Observable<number>;

    /**
     * Adds the specified elements to the specified HyperLogLog.
     */
    pfadd: OverloadedKeyCommand<string, number, R>;
    PFADD: OverloadedKeyCommand<string, number, R>;

    /**
     * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
     */
    pfcount: OverloadedCommand<string, number, R>;
    PFCOUNT: OverloadedCommand<string, number, R>;

    /**
     * Merge N different HyperLogLogs into a single one.
     */
    pfmerge: OverloadedCommand<string, boolean, R>;
    PFMERGE: OverloadedCommand<string, boolean, R>;

    /**
     * Set the value and expiration in milliseconds of a key.
     */
    psetex(key: string, milliseconds: number, value: string): Observable<'OK'>;
    PSETEX(key: string, milliseconds: number, value: string): Observable<'OK'>;

    /**
     * Inspect the state of the Pub/Sub subsytem.
     */
    pubsub: OverloadedCommand<string, number, R>;
    PUBSUB: OverloadedCommand<string, number, R>;

    /**
     * Get the time to live for a key in milliseconds.
     */
    pttl(key: string): Observable<number>;
    PTTL(key: string): Observable<number>;

    /**
     * Close the connection.
     */
    quit(): Observable<'OK'>;
    QUIT(): Observable<'OK'>;

    /**
     * Return a random key from the keyspace.
     */
    randomkey(): Observable<string>;
    RANDOMKEY(): Observable<string>;

    /**
     * Enables read queries for a connection to a cluster slave node.
     */
    readonly(): Observable<string>;
    READONLY(): Observable<string>;

    /**
     * Disables read queries for a connection to cluster slave node.
     */
    readwrite(): Observable<string>;
    READWRITE(): Observable<string>;

    /**
     * Rename a key.
     */
    rename(key: string, newkey: string): Observable<'OK'>;
    RENAME(key: string, newkey: string): Observable<'OK'>;

    /**
     * Rename a key, only if the new key does not exist.
     */
    renamenx(key: string, newkey: string): Observable<number>;
    RENAMENX(key: string, newkey: string): Observable<number>;

    /**
     * Create a key using the provided serialized value, previously obtained using DUMP.
     */
    restore(key: string, ttl: number, serializedValue: string): Observable<'OK'>;
    RESTORE(key: string, ttl: number, serializedValue: string): Observable<'OK'>;

    /**
     * Return the role of the instance in the context of replication.
     */
    role(): Observable<[string, number, Array<[string, string, string]>]>;
    ROLE(): Observable<[string, number, Array<[string, string, string]>]>;

    /**
     * Remove and get the last element in a list.
     */
    rpop(key: string): Observable<string>;
    RPOP(key: string): Observable<string>;

    /**
     * Remove the last element in a list, prepend it to another list and return it.
     */
    rpoplpush(source: string, destination: string): Observable<string>;
    RPOPLPUSH(source: string, destination: string): Observable<string>;

    /**
     * Append one or multiple values to a list.
     */
    rpush: OverloadedKeyCommand<string, number, R>;
    RPUSH: OverloadedKeyCommand<string, number, R>;

    /**
     * Append a value to a list, only if the list exists.
     */
    rpushx(key: string, value: string): Observable<number>;
    RPUSHX(key: string, value: string): Observable<number>;

    /**
     * Append one or multiple members to a set.
     */
    sadd: OverloadedKeyCommand<string, number, R>;
    SADD: OverloadedKeyCommand<string, number, R>;

    /**
     * Synchronously save the dataset to disk.
     */
    save(): Observable<string>;
    SAVE(): Observable<string>;

    /**
     * Get the number of members in a set.
     */
    scard(key: string): Observable<number>;
    SCARD(key: string): Observable<number>;

    /**
     * DEBUG - Set the debug mode for executed scripts.
     * EXISTS - Check existence of scripts in the script cache.
     * FLUSH - Remove all scripts from the script cache.
     * KILL - Kill the script currently in execution.
     * LOAD - Load the specified Lua script into the script cache.
     */
    script: OverloadedCommand<string, any, R>;
    SCRIPT: OverloadedCommand<string, any, R>;

    /**
     * Subtract multiple sets.
     */
    sdiff: OverloadedCommand<string, string[], R>;
    SDIFF: OverloadedCommand<string, string[], R>;

    /**
     * Subtract multiple sets and store the resulting set in a key.
     */
    sdiffstore: OverloadedKeyCommand<string, number, R>;
    SDIFFSTORE: OverloadedKeyCommand<string, number, R>;

    /**
     * Change the selected database for the current connection.
     */
    select(index: number | string): Observable<string>;
    SELECT(index: number | string): Observable<string>;

    /**
     * Set the string value of a key.
     */
    set(key: string, value: string): Observable<'OK'>;
    set(key: string, value: string, flag: string): Observable<'OK'>;
    set(key: string, value: string, mode: string, duration: number): Observable<[string, number, Array<[string, string, string]>]>;
    set(key: string, value: string, mode: string, duration: number, flag: string): Observable<'OK'>;
    SET(key: string, value: string): Observable<'OK'>;
    SET(key: string, value: string, flag: string): Observable<'OK'>;
    SET(key: string, value: string, mode: string, duration: number): Observable<'OK'>;
    SET(key: string, value: string, mode: string, duration: number, flag: string): Observable<'OK'>;

    /**
     * Sets or clears the bit at offset in the string value stored at key.
     */
    setbit(key: string, offset: number, value: string): Observable<number>;
    SETBIT(key: string, offset: number, value: string): Observable<number>;

    /**
     * Set the value and expiration of a key.
     */
    setex(key: string, seconds: number, value: string): Observable<string>;
    SETEX(key: string, seconds: number, value: string): Observable<string>;

    /**
     * Set the value of a key, only if the key does not exist.
     */
    setnx(key: string, value: string): Observable<number>;
    SETNX(key: string, value: string): Observable<number>;

    /**
     * Overwrite part of a string at key starting at the specified offset.
     */
    setrange(key: string, offset: number, value: string): Observable<number>;
    SETRANGE(key: string, offset: number, value: string): Observable<number>;

    /**
     * Synchronously save the dataset to disk and then shut down the server.
     */
    shutdown: OverloadedCommand<string, string, R>;
    SHUTDOWN: OverloadedCommand<string, string, R>;

    /**
     * Intersect multiple sets.
     */
    sinter: OverloadedKeyCommand<string, string[], R>;
    SINTER: OverloadedKeyCommand<string, string[], R>;

    /**
     * Intersect multiple sets and store the resulting set in a key.
     */
    sinterstore: OverloadedCommand<string, number, R>;
    SINTERSTORE: OverloadedCommand<string, number, R>;

    /**
     * Determine if a given value is a member of a set.
     */
    sismember(key: string, member: string): Observable<number>;
    SISMEMBER(key: string, member: string): Observable<number>;

    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveof(host: string, port: string | number): Observable<string>;
    SLAVEOF(host: string, port: string | number): Observable<string>;

    /**
     * Manages the Redis slow queries log.
     */
    slowlog: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>;
    SLOWLOG: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>;

    /**
     * Get all the members in a set.
     */
    smembers(key: string): Observable<string[]>;
    SMEMBERS(key: string): Observable<string[]>;

    /**
     * Move a member from one set to another.
     */
    smove(source: string, destination: string, member: string): Observable<number>;
    SMOVE(source: string, destination: string, member: string): Observable<number>;

    /**
     * Sort the elements in a list, set or sorted set.
     */
    sort: OverloadedCommand<string, string[], R>;
    SORT: OverloadedCommand<string, string[], R>;

    /**
     * Remove and return one or multiple random members from a set.
     */
    spop(key: string): Observable<string>;
    spop(key: string, count: number): Observable<string[]>;
    SPOP(key: string): Observable<string>;
    SPOP(key: string, count: number): Observable<string[]>;

    /**
     * Get one or multiple random members from a set.
     */
    srandmember(key: string): Observable<string>;
    srandmember(key: string, count: number): Observable<string[]>;
    SRANDMEMBER(key: string): Observable<string>;
    SRANDMEMBER(key: string, count: number): Observable<string[]>;

    /**
     * Remove one or more members from a set.
     */
    srem: OverloadedKeyCommand<string, number, R>;
    SREM: OverloadedKeyCommand<string, number, R>;

    /**
     * Get the length of the value stored in a key.
     */
    strlen(key: string): Observable<number>;
    STRLEN(key: string): Observable<number>;

    /**
     * Add multiple sets.
     */
    sunion: OverloadedCommand<string, string[], R>;
    SUNION: OverloadedCommand<string, string[], R>;

    /**
     * Add multiple sets and store the resulting set in a key.
     */
    sunionstore: OverloadedCommand<string, number, R>;
    SUNIONSTORE: OverloadedCommand<string, number, R>;

    /**
     * Internal command used for replication.
     */
    sync(): Observable<undefined>;
    SYNC(): Observable<undefined>;

    /**
     * Return the current server time.
     */
    time(): Observable<[string, string]>;
    TIME(): Observable<[string, string]>;

    /**
     * Get the time to live for a key.
     */
    ttl(key: string): Observable<number>;
    TTL(key: string): Observable<number>;

    /**
     * Determine the type stored at key.
     */
    type(key: string): Observable<string>;
    TYPE(key: string): Observable<string>;

    /**
     * Forget about all watched keys.
     */
    unwatch(): Observable<'OK'>;
    UNWATCH(): Observable<'OK'>;

    /**
     * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
     */
    wait(numslaves: number, timeout: number): Observable<number>;
    WAIT(numslaves: number, timeout: number): Observable<number>;

    /**
     * Watch the given keys to determine execution of the MULTI/EXEC block.
     */
    watch: OverloadedCommand<string, 'OK', R>;
    WATCH: OverloadedCommand<string, 'OK', R>;

    /**
     * Add one or more members to a sorted set, or update its score if it already exists.
     */
    zadd: OverloadedKeyCommand<string | number, number, R>;
    ZADD: OverloadedKeyCommand<string | number, number, R>;

    /**
     * Get the number of members in a sorted set.
     */
    zcard(key: string): Observable<number>;
    ZCARD(key: string): Observable<number>;

    /**
     * Count the members in a sorted set with scores between the given values.
     */
    zcount(key: string, min: number | string, max: number | string): Observable<number>;
    ZCOUNT(key: string, min: number | string, max: number | string): Observable<number>;

    /**
     * Increment the score of a member in a sorted set.
     */
    zincrby(key: string, increment: number, member: string): Observable<number>;
    ZINCRBY(key: string, increment: number, member: string): Observable<number>;

    /**
     * Intersect multiple sorted sets and store the resulting sorted set in a new key.
     */
    zinterstore: OverloadedCommand<string | number, number, R>;
    ZINTERSTORE: OverloadedCommand<string | number, number, R>;

    /**
     * Count the number of members in a sorted set between a given lexicographic range.
     */
    zlexcount(key: string, min: string, max: string): Observable<number>;
    ZLEXCOUNT(key: string, min: string, max: string): Observable<number>;

    /**
     * Return a range of members in a sorted set, by index.
     */
    zrange(key: string, start: number, stop: number): Observable<string[]>;
    zrange(key: string, start: number, stop: number, withscores: string): Observable<string[]>;
    ZRANGE(key: string, start: number, stop: number): Observable<string[]>;
    ZRANGE(key: string, start: number, stop: number, withscores: string): Observable<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range.
     */
    zrangebylex(key: string, min: string, max: string): Observable<string[]>;
    zrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Observable<string[]>;
    ZRANGEBYLEX(key: string, min: string, max: string): Observable<string[]>;
    ZRANGEBYLEX(key: string, min: string, max: string, limit: string, offset: number, count: number): Observable<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
     */
    zrevrangebylex(key: string, min: string, max: string): Observable<string[]>;
    zrevrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Observable<string[]>;
    ZREVRANGEBYLEX(key: string, min: string, max: string): Observable<string[]>;
    ZREVRANGEBYLEX(key: string, min: string, max: string, limit: string, offset: number, count: number): Observable<string[]>;

    /**
     * Return a range of members in a sorted set, by score.
     */
    zrangebyscore(key: string, min: number | string, max: number | string): Observable<string[]>;
    zrangebyscore(key: string, min: number | string, max: number | string, withscores: string): Observable<string[]>;
    zrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Observable<string[]>;
    zrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Observable<string[]>;
    ZRANGEBYSCORE(key: string, min: number | string, max: number | string): Observable<string[]>;
    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string): Observable<string[]>;
    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Observable<string[]>;
    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Observable<string[]>;

    /**
     * Determine the index of a member in a sorted set.
     */
    zrank(key: string, member: string): Observable<number | void>;
    ZRANK(key: string, member: string): Observable<number | void>;

    /**
     * Remove one or more members from a sorted set.
     */
    zrem: OverloadedKeyCommand<string, number, R>;
    ZREM: OverloadedKeyCommand<string, number, R>;

    /**
     * Remove all members in a sorted set between the given lexicographical range.
     */
    zremrangebylex(key: string, min: string, max: string): Observable<number>;
    ZREMRANGEBYLEX(key: string, min: string, max: string): Observable<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyrank(key: string, start: number, stop: number): Observable<number>;
    ZREMRANGEBYRANK(key: string, start: number, stop: number): Observable<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyscore(key: string, min: string | number, max: string | number): Observable<number>;
    ZREMRANGEBYSCORE(key: string, min: string | number, max: string | number): Observable<number>;

    /**
     * Return a range of members in a sorted set, by index, with scores ordered from high to low.
     */
    zrevrange(key: string, start: number, stop: number): Observable<string[]>;
    zrevrange(key: string, start: number, stop: number, withscores: string): Observable<string[]>;
    ZREVRANGE(key: string, start: number, stop: number): Observable<string[]>;
    ZREVRANGE(key: string, start: number, stop: number, withscores: string): Observable<string[]>;

    /**
     * Return a range of members in a sorted set, by score, with scores ordered from high to low.
     */
    zrevrangebyscore(key: string, min: number | string, max: number | string): Observable<string[]>;
    zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string): Observable<string[]>;
    zrevrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Observable<string[]>;
    zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Observable<string[]>;
    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string): Observable<string[]>;
    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string): Observable<string[]>;
    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Observable<string[]>;
    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Observable<string[]>;

    /**
     * Determine the index of a member in a sorted set, with scores ordered from high to low.
     */
    zrevrank(key: string, member: string): Observable<number | void>;
    ZREVRANK(key: string, member: string): Observable<number | void>;

    /**
     * Get the score associated with the given member in a sorted set.
     */
    zscore(key: string, member: string): Observable<string>;
    ZSCORE(key: string, member: string): Observable<string>;

    /**
     * Add multiple sorted sets and store the resulting sorted set in a new key.
     */
    zunionstore: OverloadedCommand<string | number, number, R>;
    ZUNIONSTORE: OverloadedCommand<string | number, number, R>;

    /**
     * Incrementally iterate the keys space.
     */
    scan: OverloadedCommand<string, [string, string[]], R>;
    SCAN: OverloadedCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate Set elements.
     */
    sscan: OverloadedKeyCommand<string, [string, string[]], R>;
    SSCAN: OverloadedKeyCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate hash fields and associated values.
     */
    hscan: OverloadedKeyCommand<string, [string, string[]], R>;
    HSCAN: OverloadedKeyCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate sorted sets elements and associated scores.
     */
    zscan: OverloadedKeyCommand<string, [string, string[]], R>;
    ZSCAN: OverloadedKeyCommand<string, [string, string[]], R>;
}

export const HapinessRedisClient: {
    new (options: ClientOpts): HapinessRedisClient;
};

export interface HapinessRedisClient extends Commands<boolean>, EventEmitter {
    connected: boolean;
    command_queue_length: number;
    offline_queue_length: number;
    retry_delay: number;
    retry_backoff: number;
    command_queue: any[];
    offline_queue: any[];
    connection_id: number;
    server_info: ServerInfo;
    stream: Duplex;

    on(event: 'message', listener: (channel: string, message: string) => void): this;
    on(event: 'pmessage', listener: (pattern: string, channel: string, message: string) => void): this;
    on(event: 'message_buffer', listener: (channel: string, message: string) => void): this;
    on(event: 'pmessage_buffer', listener: (pattern: string, channel: string, message: string) => void): this;
    on(event: 'subscribe', listener: (channel: string, count: number) => void): this;
    on(event: 'psubscribe', listener: (pattern: string, count: number) => void): this;
    on(event: 'unsubscribe', listener: (channel: string, count: number) => void): this;
    on(event: 'punsubscribe', listener: (pattern: string, count: number) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    /**
     * Client methods.
     */

    end(flush?: boolean): void;
    unref(): void;

    cork(): void;
    uncork(): void;

    duplicate(options?: ClientOpts): Oservable<HapinessRedisClient>;

    sendCommand(command: string): Observable<any>;
    sendCommand(command: string, args?: any[]): Observable<any>;
    send_command(command: string): Observable<any>;
    send_command(command: string, args?: any[]): Observable<any>;

    /**
     * Mark the start of a transaction block.
     */
    multi(args?: Array<Array<string | number | Callback<any>>>): Multi;
    MULTI(args?: Array<Array<string | number | Callback<any>>>): Multi;

    batch(args?: Array<Array<string | number | Callback<any>>>): Multi;
    BATCH(args?: Array<Array<string | number | Callback<any>>>): Multi;
}

export const Multi: {
    new (): Multi;
};

export interface Multi extends Commands<Multi> {
    exec(): Observable<any[]>;
    EXEC(): Observable<any[]>;

    exec_atomic(): Observable<any[]>;
    EXEC_ATOMIC(): Observable<any[]>;
}

export let debug_mode: boolean;

export function createClient(port: number, host?: string, options?: ClientOpts): HapinessRedisClient;
export function createClient(unix_socket: string, options?: ClientOpts): HapinessRedisClient;
export function createClient(redis_url: string, options?: ClientOpts): HapinessRedisClient;
export function createClient(options?: ClientOpts): HapinessRedisClient;

export function print(err: Error | void, reply: any): void;
