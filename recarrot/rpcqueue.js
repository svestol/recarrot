'use strict'

const debug = require('debug')('carrot:rpcqueue')

module.exports = (inOptions) => {
  const defaults = {
    timeout: 3000,
    interval: 50,
  }

  let stopped = false

  const options = Object.assign({}, defaults, inOptions)
  let pending = []

  let interval = setInterval(() => {
    const expired = pending.filter(e => e.expire <= Date.now())
    pending = pending.filter(e => !expired.includes(e))

    expired.forEach(e => {
      debug('pending event with correlation id', e.id, 'timed out')
      e.reject(new Error('Response timed out'))
    })
  }, options.interval)

  const func = event => {
    const found = pending.find(e => e.id === event.properties.correlationId)
    if (!found) {
      debug('did not find a pending callback for correlationId', event.properties.correlationId)
      return Promise.resolve()
    }

    pending = pending.filter(e => e !== found)
    debug('found match for correlation id', event.properties.correlationId)
    return Promise.resolve(found.resolve(event))
  }

  const wait = event => {
    if (stopped) {
      throw new Error('The queue is stopped')
    }

    return new Promise((resolve, reject) => {
      pending = [ ...pending, {
        id: event.properties.correlationId, resolve, reject, expire: Date.now() + options.timeout,
      } ]
    })
  }

  const stop = () => {
    if (stopped) {
      throw new Error('The queue is already stopped')
    }

    return new Promise((resolve, reject) => {
      const check = () => {
        debug('checking if the queue is empty')
        if (pending.length === 0) {
          debug('the queue is empty. clearing the interval')
          clearInterval(interval)
          interval = null
          resolve(true)
          return true
        }

        debug('the queue is not empty yet. setting timeout')
        setTimeout(check, 50)
      }

      debug('trying to stop the queue')
      check()
    })
  }

  return Object.defineProperties(func, {
    wait: { value: wait },
    stop: { value: stop },
  })
}
