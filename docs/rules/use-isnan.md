# require calls to `isNaN()` when checking for `NaN` (use-isnan)

In JavaScript, `NaN` is a special value of the `Number` type. It's used to represent any of the "not-a-number" values represented by the double-precision 64-bit format as specified by the IEEE Standard for Binary Floating-Point Arithmetic.

Because `NaN` is unique in JavaScript by not being equal to anything, including itself, the results of comparisons to `NaN` are confusing:

* `NaN === NaN` or `NaN == NaN` evaluate to false
* `NaN !== NaN` or `NaN != NaN` evaluate to true

Therefore, use `Number.isNaN()` or global `isNaN()` functions to test whether a value is `NaN`.

## Rule Details

This rule disallows comparisons to 'NaN'.

Examples of **incorrect** code for this rule:

```js
/*eslint use-isnan: "error"*/

if (foo == NaN) {
    // ...
}

if (foo != NaN) {
    // ...
}
```

Examples of **correct** code for this rule:

```js
/*eslint use-isnan: "error"*/

if (isNaN(foo)) {
    // ...
}

if (!isNaN(foo)) {
    // ...
}
```
