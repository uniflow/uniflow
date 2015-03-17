'use strict'

var assign = require('object-assign')
var EventEmitter = require('eventemitter3')
var objEql = require('obj-eql')

function createStore(obj) {
  var store = assign(Object.create(EventEmitter.prototype), {
    state: {},
    setState: function(change) {
      var newState = Object.freeze(assign({}, this.state, change))
      updateState(this, newState)
    },
    replaceState: function(newState) {
      newState = Object.freeze(assign({}, newState))
      updateState(this, newState)
    }
  }, obj)
  Object.freeze(store.state)
  return store
}

function updateState(store, newState) {
  if (!objEql(newState, store.state)) {
    store.state = newState
    store.emit('change')
  }
}

module.exports = createStore
