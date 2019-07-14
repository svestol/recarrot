/* eslint-env mocha */
'use strict'

const carrot = require('..')

describe('carrot:rpcqueue', () => {
  const rpc = carrot.rpcqueue({
    timeout: 100,
  })

  it('times out correctly', done => {
    rpc.wait({ properties: { correlationId: '1234' } })
      .then(() => done(new Error('Returned something when it should time out')))
      .catch(e => done())
  })

  it('matches correlation id correctly', () => {
    const event = {
      properties: { correlationId: '1234' },
      content: { test: true },
    }
    const pending = rpc.wait({ properties: { correlationId: '1234' } })

    return rpc(event)
      .then(() => pending)
  })

  after(rpc.stop)
})
