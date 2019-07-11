'use strict'

const amqp = require('amqplib')

module.exports = (uri, direction) => {
  if (!['input', 'output'].includes(direction)) {
    throw new Error('direction needs to be either input or output')
  }

  return Object.defineProperties({}, {
    type: { value: 'connection', enumerable: true },
    direction: { value: direction, enumerable: true },
    _amqp: { value: amqp.connection(uri) },
  })
}
