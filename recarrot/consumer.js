'use strict'

module.exports = (queue, callback) => {
  if (queue.type !== 'queue') {
    throw new Error('queue required')
  }
  else if (queue.channel.connection.direction !== 'input') {
    throw new Error('The channel is connected to an output connection')
  }
}
