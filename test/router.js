/* eslint-env mocha */
'use strict'

const { router: createRouter } = require('..')
const expect = require('expect.js')

describe('carrot:router', () => {
  const router = createRouter(r => {
    r.on('test.topic.*', ev => Promise.reject(new Error('test error')))
    r.on('test.#', ev => true)
  })

  router({ fields: { routingKey: 'test.topic.runner' } })
    .then(result => expect(result.length).to.be(2))
    .then(_ => expect(router.routingKeys).to.eql(['test.topic.*', 'test.#']))
})
