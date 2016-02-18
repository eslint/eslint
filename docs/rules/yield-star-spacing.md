# Enforce spacing around the `*` in `yield*` expressions (yield-star-spacing)

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule enforces spacing around the `*` in `yield*` expressions.

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.

* `before` enforces spacing between the `yield` and the `*`.
  If `true`, a space is required, otherwise spaces are disallowed.

* `after` enforces spacing between the `*` and the argument.
  If it is `true`, a space is required, otherwise spaces are disallowed.

The default is `{"before": false, "after": true}`.

```json
"yield-star-spacing": [2, {"before": true, "after": false}]
```

The option also has a string shorthand:

* `{"before": false, "after": true}` → `"after"`
* `{"before": true, "after": false}` → `"before"`
* `{"before": true, "after": true}` → `"both"`
* `{"before": false, "after": false}` → `"neither"`

```json
"yield-star-spacing": [2, "after"]
```

When using `"after"` this spacing will be enforced:

```js
/*eslint yield-star-spacing: [2, "after"]*/
/*eslint-env es6*/

function* generator() {
  yield* other();
}
```

When using `"before"` this spacing will be enforced:

```js
/*eslint yield-star-spacing: [2, "before"]*/
/*eslint-env es6*/

function *generator() {
  yield *other();
}
```

When using `"both"` this spacing will be enforced:

```js
/*eslint yield-star-spacing: [2, "both"]*/
/*eslint-env es6*/

function * generator() {
  yield * other();
}
```

When using `"neither"` this spacing will be enforced:

```js
/*eslint yield-star-spacing: [2, "neither"]*/
/*eslint-env es6*/

function*generator() {
  yield*other();
}
```

To use this rule you either need to [use the `es6` environment](../user-guide/configuring.md#specifying-environments) or
[set `ecmaVersion` to `6` in `parserOptions`](../user-guide/configuring.md#specifying-parser-options).

## When Not To Use It

If your project will not be using generators or you are not concerned with spacing consistency, you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
