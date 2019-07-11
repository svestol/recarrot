'use strict'

const debug = require('debug')('carrot:middleware')

module.exports = callback => {
  let list = []

  const func = object => {
    debug('executing', list.length, 'callbacks')
    return list.reduce((acc, cur) => {
      return acc.then(object => cur(object))
        .then(result => result || object)
    }, Promise.resolve(object))
  }

  const use = callback => {
    debug('adding callback to the middleware list')
    list = [ ...list, callback ]
    return func
  }

  Object.defineProperty(func, 'use', { value: use })

  callback && callback(func)
  return func
}
