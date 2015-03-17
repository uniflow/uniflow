'use strict'

var should = require('should')
var sinon = require('sinon')
var createActions = require('../createActions')

describe('createActions()', function() {
  it('returns an event emitter', function() {
    createActions({}).should.have.property('addListener').which.is.a.Function
  })

  it('returns object with all keys from obj', function() {
    var actions = createActions({
      foo: function () {},
      bar: function () {}
    })
    actions.should.have.property('foo').which.is.a.Function
    actions.should.have.property('bar').which.is.a.Function
  })

  it('throws when called with a non-function property of obj', function() {
    createActions.bind(null, {foo: 'bar'}).should.throw()
  })

  describe('returned method', function() {
    var func
    var actions

    beforeEach(function() {
      func = sinon.spy()
      actions = createActions({foo: func})
    })

    it('binds to the actions object', function() {
      var actionValue = actions.foo
      actionValue()
      sinon.assert.calledOn(func, actions)
    })

    it('calls the original function with aguments', function() {
      actions.foo(1, 2, 3)
      sinon.assert.calledWithExactly(func, 1, 2, 3)
    })

    it('has a partial method', function() {
      actions.foo.should.have.property('partial').which.is.a.Function
    })

    describe('.partial()', function() {
      var partial

      beforeEach(function() {
        partial = actions.foo.partial(1, 2)
      })

      it('returns a function with bound arguments', function() {
        partial(3)
        sinon.assert.calledWithExactly(func, 1, 2, 3)
      })

      it('returns a function bound to actions context', function() {
        partial()
        sinon.assert.calledOn(func, actions)
      })

      it('returns a function with a partial method', function() {
        partial.should.have.property('partial').which.is.a.Function
      })
    })
  })
})
