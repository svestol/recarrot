'use strict'

const setPropertyValue = (message, property, value) => {
  return Object.defineProperty(message, 'property', {
    value: value, enumerable: true,
  })
}

module.exports = reference => {
  const message = Object.defineProperties({}, {
    properties: { value: {}, enumerable: true },
    content: { value: {}, enumerable: true },

    messageId: { value: function (value) {
      return setPropertyValue(this, 'messageId', value)
    } },
    correlationId: { value: function (value) {
      return setPropertyValue(this, 'messageId', value)
    } },
  })

  return message
}
