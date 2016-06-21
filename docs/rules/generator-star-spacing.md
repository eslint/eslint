# Enforce spacing around the * in generator functions (generator-star-spacing)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

## Rule Details

This rule aims to enforce spacing around the `*` of generator functions.

## Options

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.

* `before` enforces spacing between the `*` and the `function` keyword.
  If it is `true`, a space is required, otherwise spaces are disallowed.

  In object literal shorthand methods, spacing before the `*` is not checked, as they lack a `function` keyword.

* `after` enforces spacing between the `*` and the function name (or the opening parenthesis for anonymous generator functions).
  If it is `true`, a space is required, otherwise spaces are disallowed.

The default is `{"before": true, "after": false}`.

```json
"generator-star-spacing": ["error", {"before": false, "after": true}]
```

And the option has shorthand as a string keyword:

* `{"before": true, "after": false}` → `"before"`
* `{"before": false, "after": true}` → `"after"`
* `{"before": true, "after": true}` → `"both"`
* `{"before": false, "after": false}` → `"neither"`

```json
"generator-star-spacing": ["error", "after"]
```

## Examples

### before

Examples of **correct** code for this rule with the `"before"` option:

```js
/*eslint generator-star-spacing: ["error", {"before": true, "after": false}]*/
/*eslint-env es6*/

function *generator() {}

var anonymous = function *() {};

var shorthand = { *generator() {} };
```

### after

Examples of **correct** code for this rule with the `"after"` option:

```js
/*eslint generator-star-spacing: ["error", {"before": false, "after": true}]*/
/*eslint-env es6*/

function* generator() {}

var anonymous = function* () {};

var shorthand = { * generator() {} };
```

### both

Examples of **correct** code for this rule with the `"both"` option:

```js
/*eslint generator-star-spacing: ["error", {"before": true, "after": true}]*/
/*eslint-env es6*/

function * generator() {}

var anonymous = function * () {};

var shorthand = { * generator() {} };
```

### neither

Examples of **correct** code for this rule with the `"neither"` option:

```js
/*eslint generator-star-spacing: ["error", {"before": false, "after": false}]*/
/*eslint-env es6*/

function*generator() {}

var anonymous = function*() {};

var shorthand = { *generator() {} };
```

## When Not To Use It

If your project will not be using generators or you are not concerned with spacing consistency, you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)