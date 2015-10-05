# No empty pattern (no-empty-pattern)

ECMAScript2015 supports destructuring, to extract data from objects and arrays, and also to handle function parameters. This rule tries to prevent a common mistake where the developer intent is to provide a default value, but creates an empty pattern instead.

```
var {a: {}} = foo;
```

## Rule Details

The following patterns are considered problems:

```js
/*eslint no-empty-pattern: 2*/

var {} = foo;
var [] = foo;
var {a: {}} = foo;
var {a: []} = foo;
function foo({}) {}
function foo([]) {}
function foo({a: {}}) {}
function foo({a: []}) {}
```

The following patterns are not considered problems:

```js
/*eslint no-empty-pattern: 2*/

var {a = {}} = foo;
var {a = []} = foo;
function foo({a = {}}) {}
function foo({a = []}) {}
```
