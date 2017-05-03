# Enforce spacing around the `*` in `yield*` statements (yield-star-spacing)

## Rule Details

Enforce a spacing policy for the `*` in `yield*` statements.

Does not affect `function*` declarations.

To use this rule you either need to [use the `es6` environment](../user-guide/configuring.md#specifying-environments) or
[set `ecmaVersion` to `6` in `parserOptions`](../user-guide/configuring.md#specifying-parser-options).

## Options

```
yield-star-spacing: [ <level>, <behavior> ]

yield-star-spacing: [ <level>, { <option>: <val>, ... } ]
```

* __level:__ (Number|String)
    * `0` or **`"off"`** _(default)_ - ignore violations
    * `1` or `"warn"` - violations generate warnings
    * `2` or `"error"` - violations generate errors (exit code `1`)
* __behavior:__  (String)
    * [**`"after"`**](#after) _(default)_ ⟶ `{"before": false, "after": true}`
    * [`"before"`](#before) ⟶ `{"before": true, "after": false}`
    * [`"both"`](#both) ⟶ `{"before": true, "after": true}`
    * [`"neither"`](#neither) ⟶ `{"before": false, "after": false}`
* __option:__ (Object)
    * `"before"` - spacing between `yeild` and `*`? `true` or `false` _(default)_
    * `"after"` - spacing between `*` and expression? `true` _(default)_ or `false`

See [Configuring Rules](../user-guide/configuring#configuring-rules) for more details.

## Examples

### after

Examples of **correct** code for this rule with the default `"after"` option:

```js
/*eslint yield-star-spacing: ["error", "after"]*/
/*eslint-env es6*/

function* generator() {
  yield* other();
}
```

### before

Examples of **correct** code for this rule with the `"before"` option:

```js
/*eslint yield-star-spacing: ["error", "before"]*/
/*eslint-env es6*/

function* generator() {
  yield *other();
}
```

### both

Examples of **correct** code for this rule with the `"both"` option:

```js
/*eslint yield-star-spacing: ["error", "both"]*/
/*eslint-env es6*/

function* generator() {
  yield * other();
}
```

### neither

Examples of **correct** code for this rule with the `"neither"` option:

```js
/*eslint yield-star-spacing: ["error", "neither"]*/
/*eslint-env es6*/

function* generator() {
  yield*other();
}
```

## Related Rules

* [generator-star-spacing](generator-star-spacing) - Enforce spacing around the * in generator functions

## When Not To Use It

If your project will not be using generators or you are not concerned with spacing consistency, you do not need this rule.

## Further Reading

* [Understanding ES6: Generators](https://leanpub.com/understandinges6/read/#leanpub-auto-generators)
* [yield* operator](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/yield*)
