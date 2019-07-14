'use strict'

const amqp = require('amqplib')

const debug = require('debug')('carrot:connection')

module.exports = (uri, direction) => {
  if (!['input', 'output'].includes(direction)) {
    debug('direction parameter was', direction, 'input or output required')
    throw new Error('direction needs to be either input or output')
  }

  debug('creating ', direction, 'connection to ', uri)

  return Object.defineProperties({}, {
    type: { value: 'connection', enumerable: true },
    direction: { value: direction, enumerable: true },
    _amqp: { value: amqp.connect(uri) },
    close: { value: function () {
      return this._amqp.then(connection => connection.close())
    } },
  })
}
