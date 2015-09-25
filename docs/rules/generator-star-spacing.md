# Enforce spacing around the * in generator functions (generator-star-spacing)

Generators are a new type of function in ECMAScript 6 that can return multiple values over time.
These special functions are indicated by placing an `*` after the `function` keyword.

Here is an example of a generator function:

```js
/*eslint-env es6*/

function* generator() {
    yield "44";
    yield "55";
}
```

This is also valid:

```js
/*eslint-env es6*/

function *generator() {
    yield "44";
    yield "55";
}
```

This is valid as well:

```js
/*eslint-env es6*/

function * generator() {
    yield "44";
    yield "55";
}
```

To keep a sense of consistency when using generators this rule enforces a single position for the `*`.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to enforce spacing around the `*` of generator functions.

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.

* `before` enforces spacing between the `*` and the `function` keyword.
  If it is `true`, a space is required, otherwise spaces are disallowed.

  In object literal shorthand methods, spacing before the `*` is not checked, as they lack a `function` keyword.

* `after` enforces spacing between the `*` and the function name.
  If it is `true`, a space is required, otherwise spaces are disallowed.

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
/*eslint generator-star-spacing: [2, {"before": true, "after": false}]*/
/*eslint-env es6*/

function *generator() {}

var anonymous = function *() {};

var shorthand = { *generator() {} };
```

When using `{"before": false, "after": true}` this placement will be enforced:

```js
/*eslint generator-star-spacing: [2, {"before": false, "after": true}]*/
/*eslint-env es6*/

function* generator() {}

var anonymous = function*() {};

var shorthand = { * generator() {} };
```

When using `{"before": true, "after": true}` this placement will be enforced:

```js
/*eslint generator-star-spacing: [2, {"before": true, "after": true}]*/
/*eslint-env es6*/

function * generator() {}

var anonymous = function *() {};

var shorthand = { * generator() {} };
```

When using `{"before": false, "after": false}` this placement will be enforced:

```js
/*eslint generator-star-spacing: [2, {"before": false, "after": false}]*/
/*eslint-env es6*/

function*generator() {}

var anonymous = function*() {};

var shorthand = { *generator() {} };
```

To use this rule you must set the `generators` flag to `true` in the `ecmaFeatures` configuration object.

## When Not To Use It

If your project will not be using generators or you are not concerned with spacing consistency, you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
