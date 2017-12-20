'use strict'

const Hemera = require('nats-hemera')
const HemeraRedis = require('./../index')
const HemeraJoi = require('hemera-joi')
const Code = require('code')
const Nats = require('nats')
const HemeraTestsuite = require('hemera-testsuite')

const expect = Code.expect

describe('Hemera-arango-store', function() {
  let PORT = 6242
  let natsUrl = 'nats://localhost:' + PORT
  let server
  let client
  let hemera

  before(function(done) {
    server = HemeraTestsuite.start_server(PORT, () => {
      const nats = Nats.connect(natsUrl)
      hemera = new Hemera(nats, {
        crashOnFatal: false,
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

  it('set', function() {
    return hemera
      .act({
        topic: 'redis-cache',
        cmd: 'set',
        key: 'example',
        value: 100
      })
      .then(resp => expect(resp).to.be.equals('OK'))
  })

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
      .then(resp => {
        expect(resp).to.be.equals('100')
      })
  })
})
