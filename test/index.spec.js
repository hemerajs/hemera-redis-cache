'use strict'

const Hemera = require('nats-hemera')
const HemeraRedis = require('./../index')
const HemeraJoi = require('hemera-joi')
const Code = require('code')
const Nats = require('nats')
const HemeraTestsuite = require('hemera-testsuite')

const expect = Code.expect

describe('Hemera-redis-cache', function() {
  let PORT = 6242
  let natsUrl = 'nats://localhost:' + PORT
  let server
  let client
  let hemera

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, () => {
      const nats = Nats.connect(natsUrl)
      hemera = new Hemera(nats, {
        logLevel: 'silent'
      })
      hemera.use(HemeraJoi)
      hemera.use(HemeraRedis)
      hemera.ready(function() {
        client = hemera.redis.client
        done()
      })
    })
  })

  after(function(done) {
    client.quit()
    hemera.close()
    server.kill()
    done()
  })

  describe('SET operation', () => {
    it('set', function() {
      return hemera
        .act({
          topic: 'redis-cache',
          cmd: 'set',
          key: 'example',
          value: 100
        })
        .then(resp => expect(resp.data).to.be.equals('OK'))
    })

    after(function(done) {
      client.del('example', done)
    })
  })

  describe('GET operation', () => {
    it('get', function() {
      return hemera
        .act({
          topic: 'redis-cache',
          cmd: 'set',
          key: 'example',
          value: 100
        })
        .then(() => {
          return hemera.act({
            topic: 'redis-cache',
            cmd: 'get',
            key: 'example'
          })
        })
        .then(resp => expect(resp.data).to.be.equals('100'))
    })

    after(function(done) {
      client.del('example', done)
    })
  })

  describe('KEYS operation', () => {
    it('keys', function() {
      return hemera
        .act({
          topic: 'redis-cache',
          cmd: 'set',
          key: 'example',
          value: 100
        })
        .then(() => {
          hemera.act({
            topic: 'redis-cache',
            cmd: 'set',
            key: 'example2',
            value: 200
          })
        })
        .then(() => {
          return hemera.act({
            topic: 'redis-cache',
            cmd: 'keys',
            pattern: 'examp*'
          })
        })
        .then(resp =>
          expect(resp.data.sort()).to.be.equals(['example', 'example2'])
        )
    })

    after(function(done) {
      client.del('example example2', done)
    })
  })
})
