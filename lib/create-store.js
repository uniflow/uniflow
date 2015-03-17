'use strict'

var assign = require('object-assign')
var EventEmitter = require('eventemitter3')
var objEql = require('obj-eql')

function createStore(obj) {
  var store = assign(Object.create(EventEmitter.prototype), {
    state: {},
    setState: function(change) {
      this.replaceState(assign({}, this.state, change))
    },
    replaceState: function(newState) {
      if (!objEql(newState, this.state)) {
        this.state = Object.freeze(newState)
        this.emit('change')
      }
    }
  }, obj)
  Object.freeze(store.state)
  return store
}

module.exports = createStore
