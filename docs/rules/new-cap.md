# require constructor names to begin with a capital letter (new-cap)

The `new` operator in JavaScript creates a new instance of a particular type of object. That type of object is represented by a constructor function. Since constructor functions are just regular functions, the only defining characteristic is that `new` is being used as part of the call. Native JavaScript functions begin with an uppercase letter to distinguish those functions that are to be used as constructors from functions that are not. Many style guides recommend following this pattern to more easily determine which functions are to be used as constructors.

```js
var friend = new Person();
```

## Rule Details

This rule requires constructor names to begin with a capital letter. Certain built-in identifiers are exempt from this rule. These identifiers are:

* `Array`
* `Boolean`
* `Date`
* `Error`
* `Function`
* `Number`
* `Object`
* `RegExp`
* `String`
* `Symbol`

Examples of **correct** code for this rule:

```js
/*eslint new-cap: "error"*/

function foo(arg) {
    return Boolean(arg);
}
```

## Options

This rule has an object option:

* `"newIsCap": true` (default) requires all `new` operators to be called with uppercase-started functions.
* `"newIsCap": false` allows `new` operators to be called with lowercase-started or uppercase-started functions.
* `"capIsNew": true` (default) requires all uppercase-started functions to be called with `new` operators.
* `"capIsNew": false` allows uppercase-started functions to be called without `new` operators.
* `"newIsCapExceptions"` allows specified lowercase-started function names to be called with the `new` operator.
* `"newIsCapExceptionPattern"` allows any lowercase-started function names that match the specified regex pattern to be called with the `new` operator.
* `"capIsNewExceptions"` allows specified uppercase-started function names to be called without the `new` operator.
* `"capIsNewExceptionPattern"` allows any uppercase-started function names that match the specified regex pattern to be called without the `new` operator.
* `"properties": true` (default) enables checks on object properties
* `"properties": false` disables checks on object properties

### newIsCap

Examples of **incorrect** code for this rule with the default `{ "newIsCap": true }` option:

```js
/*eslint new-cap: ["error", { "newIsCap": true }]*/

var friend = new person();
```

Examples of **correct** code for this rule with the default `{ "newIsCap": true }` option:

```js
/*eslint new-cap: ["error", { "newIsCap": true }]*/

var friend = new Person();
```

Examples of **correct** code for this rule with the `{ "newIsCap": false }` option:

```js
/*eslint new-cap: ["error", { "newIsCap": false }]*/

var friend = new person();
```

### capIsNew

Examples of **incorrect** code for this rule with the default `{ "capIsNew": true }` option:

```js
/*eslint new-cap: ["error", { "capIsNew": true }]*/

var colleague = Person();
```

Examples of **correct** code for this rule with the default `{ "capIsNew": true }` option:

```js
/*eslint new-cap: ["error", { "capIsNew": true }]*/

var colleague = new Person();
```

Examples of **correct** code for this rule with the `{ "capIsNew": false }` option:

```js
/*eslint new-cap: ["error", { "capIsNew": false }]*/

var colleague = Person();
```

### newIsCapExceptions

Examples of additional **correct** code for this rule with the `{ "newIsCapExceptions": ["events"] }` option:

```js
/*eslint new-cap: ["error", { "newIsCapExceptions": ["events"] }]*/

var events = require('events');

var emitter = new events();
```

### newIsCapExceptionPattern

Examples of additional **correct** code for this rule with the `{ "newIsCapExceptionPattern": "^person\.." }` option:

```js
/*eslint new-cap: ["error", { "newIsCapExceptionPattern": "^person\.." }]*/

var friend = new person.acquaintance();
var bestFriend = new person.friend();
```

### capIsNewExceptions

Examples of additional **correct** code for this rule with the `{ "capIsNewExceptions": ["Person"] }` option:

```js
/*eslint new-cap: ["error", { "capIsNewExceptions": ["Person"] }]*/

function foo(arg) {
    return Person(arg);
}
```

### capIsNewExceptionPattern

Examples of additional **correct** code for this rule with the `{ "capIsNewExceptionPattern": "^Person\.." }` option:

```js
/*eslint new-cap: ["error", { "capIsNewExceptionPattern": "^Person\.." }]*/

var friend = person.Acquaintance();
var bestFriend = person.Friend();
```

### properties

Examples of **incorrect** code for this rule with the default `{ "properties": true }` option:

```js
/*eslint new-cap: ["error", { "properties": true }]*/

var friend = new person.acquaintance();
```

Examples of **correct** code for this rule with the default `{ "properties": true }` option:

```js
/*eslint new-cap: ["error", { "properties": true }]*/

var friend = new person.Acquaintance();
```

Examples of **correct** code for this rule with the `{ "properties": false }` option:

```js
/*eslint new-cap: ["error", { "properties": false }]*/

var friend = new person.acquaintance();
```

## When Not To Use It

If you have conventions that don't require an uppercase letter for constructors, or don't require capitalized functions be only used as constructors, turn this rule off.
