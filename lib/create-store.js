'use strict'

var assign = require('object-assign')
var EventEmitter = require('eventemitter3')
var objEql = require('obj-eql')

function createStore(obj) {
  return assign(Object.create(EventEmitter.prototype), {
    state: {},
    setState: function(change) {
      this.replaceState(assign({}, this.state, change))
    },
    replaceState: function(newState) {
      if (!objEql(newState, this.state)) {
        this.state = newState
        this.emit('change')
      }
    }
  }, obj)
}

module.exports = createStore
