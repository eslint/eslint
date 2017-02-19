# The rule should warn against code that tries to use the === operator to compare against -0. (no-eq-neg-zero)

## Rule Details

The rule should warn against code that tries to use the === operator to compare against -0, since that will not work as intended. That is, code like x === -0 will pass for both +0 and -0. The author probably intended Object.is(x, -0).

Examples of **incorrect** code for this rule:

```js

if (val === -0) {
    // doSomething()...
}
```

Examples of **correct** code for this rule:

```js

if (val === 0) {
    // doSomething()...
}

```



