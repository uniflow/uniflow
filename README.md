![Uniflow](http://uniflow.github.io/img/logo.svg)

Uniflow is a flux-inspired unidirectional data flow library. It works great with
React, but it could be used just as easily with any other view library. The
primary goal of Uniflow is simplicity. The entire `lib` directory can be
read and understood in minutes. Give it a try!

## Features

### Actions

- An actions object is an `EventEmitter` (eventemitter3).
- Action methods are auto-bound to the actions object. This is great for passing actions directly as callbacks to other functions.
- Action methods have a partial method. It does what you would expect. For example: `<button onClick={itemActions.deleteItem.partial(this.props.id)}>Delete</button>`.
- Action methods emit events using `this.emit('event-name', payload)`.
- Async code belongs here.

### Stores

- A store object is an `EventEmitter`. (Notice the pattern?)
- The `store.state` property should only be mutated using `store.setState()` or `store.replaceState()`
- Emits a `'change'` event when the `state` changes. It uses shallow equality to test if `state` has changed similar to how PureRenderMixin works in React.
- Works well with Immutable.js values as properties of `state`.
- Should **never** contain async code.

### Dispatcher

- There is no dispatcher!

## Installation

```bash
$ npm install uniflow --save
```

## Usage

### Example

```js
var uniflow = require('uniflow')
var superagent = require('superagent')
var resourceUrl = '[some url]'


// define actions
var PersonActions = uniflow.createActions({
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
var PersonStore = uniflow.createStore({
  fullName() {
    return this.state.first + ' ' + this.state.last
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


### API

#### Actions

##### `actions = uniflow.createActions(proto)`

* `proto` object

Creates an Actions object with all of the properties of `proto`. Within the methods of `proto` be sure to call `this.emit('<name of action>')` for listening stores to update properly. Asynchronous tasks, like fetching data, should be performed in Actions.

##### `actions.on`, `actions.once`, `actions.emit`, etc.

See [eventemitter3](https://github.com/primus/eventemitter3) and [Node.js events](https://nodejs.org/api/events.html) documentation for details.


#### Store

##### `store = uniflow.createStore(proto)`

* `proto` object

Creates a Store object with all of the properties of `proto`. A Store should listen to Actions and call `this.setState(newState)` to keep itself up to date. A `change` event will be emitted automatically when the Store has updated its state. Stores should be completely synchronous.

##### `store.state`

Holds the current values for the store. By default, the initial `state` is an empty object (`{}`). You can override the initial `state` by declaring a `state` property in `proto`.

##### `store.setState(newState)`

* `newState` object

Merges `newState` with the current `state`. If any properties have changed, `store` emits a `"change"` event. This comparison is shallow, so see the following examples to ensure `"change"` occurs when you expect it to.

```js
// don't ever do this
this.state.foo = 'updated';
this.setState(this.state);

// do this instead
this.setState({ foo:'updated' });


// don't do this either
var bar = this.state.bar;
bar.baz = 'updated';
this.setState({ bar:bar });

// do something like this instead
var bar = _.assign({}, this.state.bar, { baz:'updated' });
this.setState({ bar:bar });
```

##### `store.on`, `store.once`, `store.emit`, etc.

See [eventemitter3](https://github.com/primus/eventemitter3) and [Node.js events](https://nodejs.org/api/events.html) documentation for details.
