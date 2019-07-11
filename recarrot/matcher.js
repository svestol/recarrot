'use strict'

const debug = require('debug')('carrot:matcher')

module.exports = () => {
  return (key, pattern) => {
    debug('checking if', key, 'matches the pattern', pattern)

    const patternArray = pattern.split('.')
    const keyArray = key.split('.')

    for (const idx in keyArray) {
      if (patternArray[idx] === '#') {
        return true
      }
      if (patternArray[idx] === '*') {
        continue
      }
      if (keyArray[idx] === patternArray[idx]) {
        continue
      }
      return false
    }

    return keyArray.length === patternArray.length
  }
}
