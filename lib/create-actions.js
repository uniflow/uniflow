'use strict'

var EventEmitter = require('eventemitter3')

function createActions(obj) {
  var actions = Object.create(EventEmitter.prototype)
  Object.keys(obj).forEach(function(key) {
    actions[key] = makeAction(obj[key], actions)
  })
  return actions
}

function makePartialFn(func, context) {
  return function() {
    var args = [].slice.call(arguments, 0)
    args.unshift(context)
    var partial = Function.bind.apply(func, args)
    partial.partial = makePartialFn(partial, context)
    return partial
  }
}

function makeAction(func, context) {
  var action = func.bind(context)
  action.partial = makePartialFn(action, context)
  return action
}

module.exports = createActions
