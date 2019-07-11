/* eslint-env mocha */
'use strict'

const { middleware } = require('..')
const expect = require('expect.js')

describe('middleware', () => {
  it('executes synchroniously', () => {
    const mware = middleware(config => {
      config.use(object => {
        return new Promise(resolve => setTimeout(resolve, 100))
          .then(_ => ({ ...object, initial: true }))
      })
    })
    mware.use(object => {
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(_ => ({ ...object, first: true }))
    })

    mware.use(object => {
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(_ => ({ ...object, second: true }))
    })

    return mware({ original: true })
      .then(object => {
        expect(object.original).to.be(true)
        expect(object.initial).to.be(true)
        expect(object.first).to.be(true)
        expect(object.second).to.be(true)
      })
  })

  it('can handle no return value', () => {
    const mware = middleware(config => {
      config.use(object => {
        object.works = true
      })
    })

    return mware({})
      .then(object => expect(object.works).to.be(true))
  })
})
