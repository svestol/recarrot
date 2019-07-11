'use strict'

module.exports = (channel, name, type, options = {}) => {
  if (channel.type !== 'channel') {
    throw new Error('channel required')
  }

  return Object.defineProperties({}, {
    type: { value: 'exchange', enumerable: true },
    name: { value: name, enumerable: true },
    options: { value: options, enumerable: true },
    exchangeType: { value: type, enumerable: true },
    channel: { value: channel, enumerable: true },
    _amqp: { value: channel._amqp.then(chan => chan.assertExchange(name, type, options)) },
  })
}
