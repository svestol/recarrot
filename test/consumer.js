/* eslint-env mocha */
'use strict'

const carrot = require('..')
// const expect = require('expect.js')

describe('carrot:consumer', () => {
  const inConnection = carrot.connection(process.env.RABBITMQ_URI, 'input')
  const outConnection = carrot.connection(process.env.RABBITMQ_URI, 'output')

  const inChannel = carrot.channel(inConnection, true)
  const outChannel = carrot.channel(outConnection, true)

  const exchange = carrot.exchange(outChannel, 'recarrot', 'topic', {
    durable: false, autoDelete: true,
  })

  const queue = carrot.queue(inChannel, 'recarrot-queue', {
    durable: false, autoDelete: true,
  })

  const consumer = carrot.consumer(queue)
  const publisher = carrot.publisher(exchange)

  it('responds to messages', done => {
    queue.bind(exchange, '#')
      .then(() => consumer(ev => done()))
      .then(() => publisher('test', { content: { paylaod: true } }))
  })

  after(() => Promise.all([ inChannel.recover(), outChannel.recover() ])
    .then(() => Promise.all([ inConnection.close(), outConnection.close() ]))
  )
})
