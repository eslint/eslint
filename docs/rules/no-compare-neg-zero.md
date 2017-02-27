# disallow comparing against -0 (no-compare-neg-zero)

## Rule Details

The rule should warn against code that tries to compare against -0, since that will not work as intended. That is, code like x === -0 will pass for both +0 and -0. The author probably intended Object.is(x, -0).

Examples of **incorrect** code for this rule:

```js

if (x === -0) {
    // doSomething()...
}
```

Examples of **correct** code for this rule:

```js

if (x === 0) {
    // doSomething()...
}
```

```js

if (Object.is(x, -0)) {
    // doSomething()...
}
```


