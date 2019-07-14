/*  eslint-env mocha */
'use strict'

const carrot = require('..')
const expect = require('expect.js')

describe('carrot:CarrotMessage', () => {
  it('yes', () => {
    const message = carrot.message({ abhsafhj: true })
      .messageId('1234')

    expect(message.properties).to.eql({
      messageId: '1234',
    })

    expect(message.messageId()).to.be('1234')
  })
})
