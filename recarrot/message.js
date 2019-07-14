'use strict'

class CarrotMessage {
  constructor (event) {
    if (!event) {
      event = {
        properties: {
          contentType: 'application/json',
          contentEncoding: 'identity',
        },
        content: {},
      }
    }
    Object.defineProperties(this, {
      fields: { value: Object.freeze(event.fields || {}) },
      properties: { value: Object.freeze({ ...event.properties }), enumerable: true },
      content: { value: Object.freeze({ ...event.content }), enumerable: true },
    })
  }

  setProperty (name, value, replace) {
    if (!value) {
      return this.properties[name]
    }

    if (!replace && this.properties[name]) {
      throw new Error(`property ${name} already set`)
    }

    return new CarrotMessage({
      properties: { ...this.properties, [name]: value },
      content: this.content,
    })
  }

  messageId (value, replace) {
    return this.setProperty('messageId', value, replace)
  }

  correlationId (value, replace) {
    return this.setProperty('correlationId', value, replace)
  }

  expiration (value, replace) {
    return this.setProperty('expiration', value, replace)
  }

  userId (value, replace) {
    return this.setProperty('userId', value, replace)
  }

  cc (value, replace) {
    return this.setProperty('CC', value, replace)
  }

  bcc (value, replace) {
    return this.setProperty('BCC', value, replace)
  }

  priority (value, replace) {
    return this.setProperty('priority', value, replace)
  }

  persistent (value, replace) {
    return this.setProperty('persistent', value, replace)
  }

  mandatory (value, replace) {
    return this.setProperty('mandatory', value, replace)
  }

  headers (value, replace) {
    return this.setProperty('headers', value, replace)
  }

  replyTo (value, replace) {
    return this.setProperty('replyTo', value, replace)
  }

  timestamp (value, replace) {
    return this.setProperty('timestamp', value, replace)
  }

  type (value, replace) {
    return this.setProperty('type', value, replace)
  }

  appId (value, replace) {
    return this.setProperty('appId', value, replace)
  }

  content (value, merge) {
    if (!value) {
      return { ...this.content } || {}
    }

    if (merge) {
      return new CarrotMessage({
        properties: this.properties,
        content: { ...this.content, ...value },
      })
    }

    return new CarrotMessage({
      properties: this.properties,
      content: { ...value },
    })
  }
}

module.exports = event => {
  return new CarrotMessage(event)
}
