# Enforce the position of the * in generators (generator-star)

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
option for this rule is a string specifying the placement of the asterick. For this option you may pass either
`"start"` or `"end"`. The default is `"end"`.

You can set the style in configuration like this:

```json
"generator-star": [2, "start"]
```

When using `"start"` this placement will be enforced:

```js
function* generator() {
}
```

When using `"end"` this placement will be enforced:

```js
function *generator() {
}
```

When using the expression syntax `"start"` will be enforced here:

```js
var generator = function* () {
}
```

When using the expression syntax `"end"` will be enforced here:

```js
var generator = function *() {
}
```

When using the expression syntax this is valid for both `"start"` and `"end"`:

```js
var generator = function*() {
}
```

To use this rule you must set the `generators` flag to `true` in the `ecmaFeatures` configuration object.

Also note, that shortened object literal syntax for generators is not affected by this rule.

## When Not To Use It

If your project will not be using generators you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
