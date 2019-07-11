/* eslint-env mocha */
'use strict'

const { matcher } = require('..')
const expect = require('expect.js')

describe('carrot:matcher', () => {
  const match = matcher()

  it('matches correctly', () => {
    expect(match('test.test', 'test.test')).to.be(true)
    expect(match('test.test', 'test.*')).to.be(true)
    expect(match('test', 'test.*')).to.be(false)
    expect(match('test.test.break', 'test.*')).to.be(false)
    expect(match('test.test.dont-break', 'test.#')).to.be(true)
  })
})
