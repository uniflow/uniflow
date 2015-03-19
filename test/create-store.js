'use strict'

var should = require('should')
var sinon = require('sinon')
var createStore = require('../lib/create-store')

describe('createStore(obj)', function() {
  describe('returned store', function() {
    var store

    beforeEach(function() {
      store = createStore({})
    })

    it('is an event emitter', function() {
      store.should.have.property('addListener').which.is.a.Function
    })

    it('has a state property that is an object', function() {
      store.should.have.property('state').which.is.an.Object
    })

    it('has all properties from obj', function() {
      store = createStore({foo: 1, bar: 2})
      store.should.have.property('foo', 1)
      store.should.have.property('bar', 2)
    })

    it('has frozen state property', function() {
      Object.isFrozen(store.state).should.be.true
    })

    describe('.setState(change)', function() {
      it('assigns properties of change to store.state', function() {
        store.setState({foo: 'bar'})
        store.state.should.have.property('foo', 'bar')
      })

      it('updates state with a new frozen state', function() {
        store.setState({foo: 'bar'})
        Object.isFrozen(store.state).should.be.true
      })

      it('emits a change event', function() {
        var listener = sinon.spy()
        store.on('change', listener)
        store.setState({foo: 'bar'})
        sinon.assert.calledOnce(listener)
      })

      it('does not emit a change event if state does not change', function() {
        var listener = sinon.spy()
        store.setState({foo: 'bar'})
        store.on('change', listener)
        store.setState({foo: 'bar'})
        sinon.assert.notCalled(listener)
      })
    })

    describe('.replaceState(newState)', function() {
      it('replace store.state with newState', function() {
        store.setState({foo: 'bar'})
        var expected = {bar: 'baz'}
        store.replaceState(expected)
        store.state.should.eql(expected)
      })

      it('updates state with a new frozen state', function() {
        store.replaceState({foo: 'bar'})
        Object.isFrozen(store.state).should.be.true
      })

      it('emits a change event', function() {
        var listener = sinon.spy()
        store.on('change', listener)
        store.replaceState({foo: 'bar'})
        sinon.assert.calledOnce(listener)
      })

      it('does not emit a change event if state does not change', function() {
        var listener = sinon.spy()
        store.setState({foo: 'bar'})
        store.on('change', listener)
        store.replaceState({foo: 'bar'})
        sinon.assert.notCalled(listener)
      })
    })
  })
})