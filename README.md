# Uniflow

A flux inspired unidirectional data flow library.

## Installation

```bash
$ npm install uniflow --save
```

## Usage

```js
var Uniflow = require('uniflow')
var superagent = require('superagent')
var resourceUrl = '[some url]'


// define actions
var PersonActions = Uniflow.createActions({
  changeName(first, last) {
    this.emit('name-change-pending', first, last)
    // async code always belongs in an action
    superagent
      .put(resourceUrl)
      .send({first, last})
      .end(this.changeNameResponse) // use other actions as callbacks
  },
  changeNameResponse(err, res) {
    if (err) {
      return this.emit('name-change-error', err)
    }
    this.emit('name-change-success', res.body.first, res.body.last)
  }
})


// define store
var PersonStore = Uniflow.createStore({
  fullName() {
    return this.state.firstName + ' ' + this.state.lastName
  }
})


// stores subscribe to actions
PersonActions.on('name-change-pending', function(first, last) {
  PersonStore.setState({first, last, status: 'pending'})
})

PersonActions.on('name-change-success', function(first, last) {
  PersonStore.setState({first, last, status: 'saved'})
})

PersonActions.on('name-change-error', function(error) {
  PersonStore.setState({error, status: 'error'})
})


// views subscribe to stores
PersonStore.on('change', function() {
  if (PersonStore.state.status === 'error') {
    return console.error(PersonStore.state.error)
  }
  console.log(PersonStore.fullName())
})


// views initiate actions
PersonActions.changeName('Tobias', 'Funke')
```
