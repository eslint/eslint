# Disallow `>` and `>=` operators (no-greater-than)

One simple thing that comes up time and time again is the use of the greater than sign as part of a conditional while programming. Removing it cleans up code:

- `(5 < x && x < 10)`: nicely expresses *"x is between 5 and 10"* because it is **literally between** 5 and 10,
- `(x < 5 || 10 < x)`: nicely expresses *"x is outside the limits of 5 and 10"* because it is **literally outside** of 5 to 10.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/* eslint no-greater-than: "error" */

if (2 > 1) {
    // ...
}

if (2 >= 1) {
    // ...
}
```

Examples of **correct** code for this rule:

```js
/* eslint no-greater-than: "error" */

if (1 < 2) {
    // ...
}

if (1 <= 2) {
    // ...
}
```

## When Not To Use It

This rule can conflict with the [`yoda`](http://eslint.org/docs/rules/yoda) one:

```js
/* eslint no-greater-than: "error" */
/* eslint yoda: "error" */

// this makes no-greater-then fail:
if (0 > index) {
    // ...
}

// but this makes yoda fail:
if (index < 0) {
    // ...
}
```

If you want to use both, enable `yoda`'s [`"onlyEquality"` property](http://eslint.org/docs/rules/yoda#options):

```js
/* eslint no-greater-than: "error" */
/* eslint yoda: ["error", "never", { "onlyEquality": true }] */

// valid for both no-greater-than and yoda:
if (index < 0) {
    // ...
}
```

## Further Reading

- http://llewellynfalco.blogspot.co.uk/2016/02/dont-use-greater-than-sign-in.html
