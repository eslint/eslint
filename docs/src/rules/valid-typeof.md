---
title: valid-typeof
rule_type: problem
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
---





For a vast majority of use cases, the result of the `typeof` operator is one of the following string literals: `"undefined"`, `"object"`, `"boolean"`, `"number"`, `"string"`, `"function"`, `"symbol"`, and `"bigint"`. It is usually a typing mistake to compare the result of a `typeof` operator to other string literals.

## Rule Details

This rule enforces comparing `typeof` expressions to valid string literals.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint valid-typeof: "error"*/

typeof foo === "strnig"
typeof foo == "undefimed"
typeof bar != "nunber"
typeof bar !== "fucntion"
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint valid-typeof: "error"*/

typeof foo === "string"
typeof bar == "undefined"
typeof foo === baz
typeof bar === typeof qux
```

:::

## Options

This rule has an object option:

* `"requireStringLiterals": true` allows the comparison of `typeof` expressions with only string literals or other `typeof` expressions, and disallows comparisons to any other value. Default is `false`.

### requireStringLiterals

Examples of **incorrect** code with the `{ "requireStringLiterals": true }` option:

::: incorrect

```js
/*eslint valid-typeof: ["error", { "requireStringLiterals": true }]*/

typeof foo === undefined
typeof bar == Object
typeof baz === "strnig"
typeof qux === "some invalid type"
typeof baz === anotherVariable
typeof foo == 5
```

:::

Examples of **correct** code with the `{ "requireStringLiterals": true }` option:

::: correct

```js
/*eslint valid-typeof: ["error", { "requireStringLiterals": true }]*/

typeof foo === "undefined"
typeof bar == "object"
typeof baz === "string"
typeof bar === typeof qux
```

:::

## When Not To Use It

You may want to turn this rule off if you will be using the `typeof` operator on host objects.
