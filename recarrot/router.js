'use strict'

const debug = require('debug')('carrot:router')
const matcher = require('./matcher')

module.exports = callback => {
  const match = matcher()

  let routes = []

  const func = event => {
    const key = event.fields.routingKey
    const matches = routes.filter(route => {
      return match(key, route.pattern)
    })

    debug('matched', matches.length, 'routes')
    return Promise.all(matches.map(route => Promise.resolve(route.callback(event)).catch(err => err)))
  }

  const on = (pattern, callback) => {
    debug('registering callback for pattern', pattern)
    routes = [ ...routes, { pattern, callback } ]
    return func
  }

  const routingKeys = () => {
    return routes.map(e => e.pattern)
  }

  Object.defineProperties(func, {
    on: { value: on },
    routingKeys: { get: () => routingKeys() },
  })

  callback && callback(func)

  return func
}
