'use strict'

const debug = require('debug')('carrot:channel')

module.exports = (connection, confirm) => {
  if (connection.type !== 'connection') {
    debug('parameter is not a connection.', connection.type, 'given')
    throw new Error('connection required')
  }

  const amqpChannel = confirm
    ? connection._amqp.then(conn => conn.createConfirmChannel())
    : connection._amqp.then(conn => conn.createChannel())

  const modeString = `channel in ${confirm ? 'confirm' : 'normal'} mode`
  debug('creating', connection.direction, modeString)

  return Object.defineProperties({}, {
    type: { value: 'channel', enumerable: true },
    connection: { value: connection, enumerable: true },
    confirm: { value: !!confirm, enumerable: true },
    _amqp: { value: amqpChannel, enumerable: true },
    recover: { value: function () {
      return this._amqp.then(channel => channel.recover())
    } },
  })
}
