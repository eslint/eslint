# Enforce the spacing around the * in generators (generator-star-spacing)

Generators are a new type of function in ECMAScript 6 that can return multiple values over time.
These special functions are indicated by placing an `*` after the `function` keyword.

Here is an example of a generator function:

```js
function* generator() {
    yield "44";
    yield "55";
}
```

This is also valid:

```js
function *generator() {
    yield "44";
    yield "55";
}
```

This is valid as well:

```js
function * generator() {
    yield "44";
    yield "55";
}
```

To keep a sense of consistency when using generators this rule enforces a single position for the `*`.

## Rule Details

This rule aims to enforce spacing around `*` of the generator function.

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.

* `before` aims to spacing between the `*` and the `function` keyword.
  If it's `true`, space is enforced, otherwise space is disallowed.

  In object literal shorthand methods, spacing before the `*` is not checked, as they lack a `function` keyword.

* `after` aims to spacing between the `*` and the function name.
  If it's `true`, space is enforced, otherwise space is disallowed.

  In anonymous function expressions, spacing between the `*` and the opening parenthesis is not checked. This is checked by the [space-before-function-paren](space-before-function-paren.md) rule.

The default is `{"before": true, "after": false}`.

```json
"generator-star-spacing": [2, {"before": false, "after": true}]
```

And the option has shorthand as a string keyword:

* `{"before": true, "after": false}` → `"before"`
* `{"before": false, "after": true}` → `"after"`
* `{"before": true, "after": true}` → `"both"`
* `{"before": false, "after": false}` → `"neither"`

```json
"generator-star-spacing": [2, "after"]
```

When using `{"before": true, "after": false}` this placement will be enforced:

```js
function *generator() {}

var anonymous = function *() {};

var shorthand = { *generator() {} };
```

When using `{"before": false, "after": true}` this placement will be enforced:

```js
function* generator() {}

var anonymous = function*() {};

var shorthand = { * generator() {} };
```

When using `{"before": true, "after": true}` this placement will be enforced:

```js
function * generator() {}

var anonymous = function *() {};

var shorthand = { * generator() {} };
```

When using `{"before": false, "after": false}` this placement will be enforced:

```js
function*generator() {}

var anonymous = function*() {};

var shorthand = { *generator() {} };
```

To use this rule you must set the `generators` flag to `true` in the `ecmaFeatures` configuration object.

## When Not To Use It

If your project will not be using generators you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
