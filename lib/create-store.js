'use strict'

var assign = require('object-assign')
var EventEmitter = require('eventemitter3')
var objEql = require('obj-eql')

function createStore (obj) {
  var store = assign(Object.create(EventEmitter.prototype), {
    state: {},
    setState: function (change) {
      this.replaceState(assign({}, this.state, change))
    },
    replaceState: function (newState) {
      newState.store = this
      if (!objEql(newState, this.state)) {
        this.state = newState
        this.emit('change')
      }
    }
  }, obj)

  Object.keys(store).forEach(function (key) {
    if (typeof store[key] === 'function') {
      store[key] = store[key].bind(store)
    }
  })

  return store
}

module.exports = createStore
