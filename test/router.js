/* eslint-env mocha */
'use strict'

const { router: createRouter } = require('..')
const expect = require('expect.js')

describe('carrot:router', () => {
  const router = createRouter(r => {
    r.on('test.topic.runner', ev => true)
    r.on('test.topic.*', ev => true)
    r.on('test.#', ev => true)
  })

  it('router', () => {
    return router({ fields: { routingKey: 'test.topic.runner' } })
      .then(_ => expect(router.routingKeys).to.eql(['test.topic.runner', 'test.topic.*', 'test.#']))
  })
})
