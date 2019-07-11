'use strict'

module.exports = (connection, confirm) => {
  if (connection.type !== 'connection') {
    throw new Error('connection required')
  }

  const amqpChannel = confirm
    ? connection._amqp.then(conn => conn.createConfirmChannel())
    : connection._amqp.then(conn => conn.createChannel())

  return Object.defineProperties({}, {
    type: { value: 'channel', enumerable: true },
    connection: { value: connection, enumerable: true },
    confirm: { value: !!confirm, enumerable: true },
    _amqp: { value: amqpChannel, enumerable: true },
  })
}
