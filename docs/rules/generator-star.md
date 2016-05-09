# generator-star: enforce consistent spacing around the asterisk in generator functions

(removed) This rule was **removed** in ESLint v1.0 and **replaced** by the [generator-star-spacing](generator-star-spacing.md) rule.

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

This rule enforces that the `*` is either placed next to the `function` keyword or the name of the function. The single
option for this rule is a string specifying the placement of the asterisk. For this option you may pass
`"start"`, `"middle"` or `"end"`. The default is `"end"`.

You can set the style in configuration like this:

```json
"generator-star": ["error", "start"]
```

When using `"start"` this placement will be enforced:

```js
/*eslint-env es6*/

function* generator() {
}
```

When using `"middle"` this placement will be enforced:

```js
/*eslint-env es6*/

function * generator() {
}
```

When using `"end"` this placement will be enforced:

```js
/*eslint-env es6*/

function *generator() {
}
```

When using the expression syntax `"start"` will be enforced here:

```js
/*eslint-env es6*/

var generator = function* () {
}
```

When using the expression syntax `"middle"` will be enforced here:

```js
/*eslint-env es6*/

var generator = function * () {
}
```

When using the expression syntax `"end"` will be enforced here:

```js
/*eslint-env es6*/

var generator = function *() {
}
```

When using the expression syntax this is valid for both `"start"` and `"end"`:

```js
/*eslint-env es6*/

var generator = function*() {
}
```

The shortened object literal syntax for generators is not affected by this rule.

## When Not To Use It

If your project will not be using generators you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
