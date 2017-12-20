# Hemera-redis-cache package
[![Build Status](https://travis-ci.org/hemerajs/hemera-redis-cache.svg?branch=master)](https://travis-ci.org/hemerajs/hemera-redis-cache)
[![npm](https://img.shields.io/npm/v/hemera-redis-cache.svg?maxAge=3600)](https://www.npmjs.com/package/hemera-redis-cache)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](#badge)

This is a plugin to use [Redis](https://redis.io/) as caching layer with Hemera. Underlying driver [Node Redis](https://github.com/NodeRedis/node_redis)

#### Example

```js
const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const nats = require('nats').connect()
const HemeraRedisCache = require('hemera-redis-cache')

const hemera = new Hemera(nats, {
  logLevel: 'info'
})

hemera.use(HemeraJoi)
hemera.use(HemeraRedisCache)
```

## Run Redis
```bash
$ docker-compose up
```

## Dependencies
- hemera-joi
