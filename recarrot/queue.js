'use strict'

module.exports = (channel, name, options = {}) => {
  if (channel.type !== 'channel') {
    throw new Error('channel required')
  }

  const bind = (exchange, patterns) => {
    if (exchange.type !== 'exchange') {
      throw new Error('exchange required')
    }

    return channel._amqp.then(channel => {
      if (patterns.constructor !== Array) {
        patterns = [ patterns ]
      }

      return Promise.all(patterns.map(pattern => {
        return channel.bindQueue(name, exchange.name, pattern)
      })).then(() => true)
    })
  }

  return Object.defineProperties({}, {
    type: { value: 'queue', enumerable: true },
    name: { value: name, enumerable: true },
    options: { value: options, enumerable: true },
    channel: { value: channel, enumerable: true },
    bind: { value: bind },
    _amqp: { value: channel._amqp.then(chan => chan.assertQueue(name, options)) },
  })
}
