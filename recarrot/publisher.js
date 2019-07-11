'use strict'

module.exports = queue => {
  if (queue.type !== 'queue' && queue.type !== 'exchange') {
    throw new Error('queue or exchange required')
  }
  else if (queue.channel.connection.direction !== 'output') {
    throw new Error('The channel is connected to an input connection')
  }
  if (queue.type === 'exchange') {
    return (routingKey, event) => {
      return queue.channel._amqp.then(chan => {
        if (!queue.channel.confirm) {
          return chan.publish(queue.name, routingKey, event.content, event.options)
        }
        return new Promise((resolve, reject) => {
          return chan.publish(queue.name, routingKey, event.content, event.options, err => {
            return err ? reject(err) : resolve()
          })
        })
      })
    }
  }
  else {
    return event => {
      return queue.channel._amqp.then(chan => {
        if (!queue.channel.confirm) {
          return chan.publish('', queue.name, event.content, event.options)
        }
        return new Promise((resolve, reject) => {
          return chan.publish('', queue.name, event.content, event.options, err => {
            return err ? reject(err) : resolve()
          })
        })
      })
    }
  }
}
