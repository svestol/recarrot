'use strict'

const debug = require('debug')('carrot:consumer')

module.exports = queue => {
  if (queue.type !== 'queue') {
    throw new Error('queue required')
  }
  else if (queue.channel.connection.direction !== 'input') {
    throw new Error('The channel is connected to an output connection')
  }

  const func = callback => {
    return queue.channel._amqp
      .then(channel => channel.consume(queue.name, event => {
        event = { ...event, content: JSON.parse(event.content.toString()) }
        return Promise.resolve(callback(event))
          .then(() => channel.ack(event))
          .catch(e => {
            debug(e)
            channel.nack(event, false, true)
          })
      }))
  }

  return func
}
