'use strict'

const debug = require('debug')('carrot:router')
const matcher = require('./matcher')

const assignScore = (inKey, inPattern) => {
  const key = inKey.split('.')
  const pattern = inPattern.split('.')

  let score = 0

  key.forEach((keyPart, idx) => {
    if (keyPart === pattern[idx]) {
      score += 3
    }
    else if (pattern[idx] === '*') {
      score += 2
    }
    else if (pattern[idx] === '#') {
      score += 1
    }
  })

  return score
}

const findBestMatch = (key, matches) => {
  let highestScore = 0
  let rv = null

  matches.forEach(match => {
    const score = assignScore(key, match.pattern)
    if (score > highestScore) {
      highestScore = score
      rv = match
    }
  })

  return rv
}

module.exports = callback => {
  const match = matcher()

  let routes = []

  const func = event => {
    const key = event.fields.routingKey
    const matches = routes.filter(route => {
      return match(key, route.pattern)
    })

    debug('matched', matches.length, 'routes')
    debug('finding longest most specific match')

    const bestMatch = findBestMatch(event.fields.routingKey, matches)

    debug('found', bestMatch.pattern)
    return Promise.resolve(bestMatch.callback(event))
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
