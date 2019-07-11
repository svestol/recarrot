'use strict'

const debug = require('debug')('carrot:rpcqueue')

module.exports = (inOptions) => {
  const defaults = {
    timeout: 3000,
    interval: 50,
  }

  const options = Object.assign({}, defaults, inOptions)
  let pending = []

  let interval = setInterval(() => {
    const expired = pending.filter(e => e.expire <= Date.now())
    pending = pending.filter(e => !expired.includes(e))

    expired.forEach(e => {
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
    return Promise.resolve(found.resolve(event))
  }

  const wait = event => {
    return new Promise((resolve, reject) => {
      pending = [ ...pending, {
        id: event.properties.correlationId, resolve, reject, expire: Date.now() + options.timeout,
      } ]
    })
  }

  const stop = () => {
    // fix so the queue drains before resolving
    clearInterval(interval)
    interval = null
  }

  return Object.defineProperties(func, {
    wait: { value: wait },
    stop: { value: stop },
  })
}
