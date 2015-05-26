'use strict'

var EventEmitter = require('eventemitter3')
var asap = require('asap')

function createActions (obj) {
  var actions = Object.create(EventEmitter.prototype)
  Object.keys(obj).forEach(function (key) {
    actions[key] = makeAction(obj[key], actions)
  })
  return actions
}

function makePartialFn (func, context) {
  return function () {
    var args = [].slice.call(arguments, 0)
    args.unshift(context)
    var partial = Function.bind.apply(func, args)
    partial.partial = makePartialFn(partial, context)
    return partial
  }
}

function makeAction (func, context) {
  if (typeof func !== 'function') {
    throw new TypeError('Uniflow action must be a function.')
  }
  var action = function () {
    var args = arguments
    asap(function () {
      func.apply(context, args)
    })
  }
  action.partial = makePartialFn(action, context)
  return action
}

module.exports = createActions
