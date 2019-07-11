'use strict'

module.exports = (channel, name, options = {}) => {
  if (channel.type !== 'channel') {
    throw new Error('channel required')
  }

  return Object.defineProperties({}, {
    type: { value: 'queue', enumerable: true },
    name: { value: name, enumerable: true },
    options: { value: options, enumerable: true },
    channel: { value: channel, enumerable: true },
    _amqp: { value: channel._amqp.then(chan => chan.assertQueue(name, options)) },
  })
}
