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

This rule enforces that the `*` is either placed next to the `function` keyword or the name of the function. The single
option for this rule is a string specifying the placement of the asterisk. For this option you may pass `"before"`, `"after"`, `"both"`, or `"neither"`. The default is `"before"`.

You can set the style in configuration like this:

```json
"generator-star-spacing": [2, "after"]
```

In anonymous function expressions, spacing between the asterisk and the opening parenthesis is not checked. This is checked by the [space-before-function-paren](space-before-function-paren.md) rule.

In object literal shorthand methods, spacing before the asterisk is not checked, as they lack a `function` keyword.

When using `"before"` this placement will be enforced:

```js
function *generator() {}

var anonymous = function *() {};

var shorthand = { *generator() {} };
```

When using `"after"` this placement will be enforced:

```js
function* generator() {}

var anonymous = function*() {};

var shorthand = { * generator() {} };
```

When using `"both"` this placement will be enforced:

```js
function * generator() {}

var anonymous = function *() {};

var shorthand = { * generator() {} };
```

When using `"neither"` this placement will be enforced:

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
