# enforce comparing `typeof` expressions against valid strings (valid-typeof)

For a vast majority of use cases, the result of the `typeof` operator is one of the following string literals: `"undefined"`, `"object"`, `"boolean"`, `"number"`, `"string"`, `"function"` and `"symbol"`. It is usually a typing mistake to compare the result of a `typeof` operator to other string literals.

## Rule Details

This rule enforces comparing `typeof` expressions to valid string literals.

## Options

This rule has an object option:

* `"requireStringLiterals": true` requires `typeof` expressions to only be compared to string literals or other `typeof` expressions, and disallows comparisons to any other value.

Examples of **incorrect** code for this rule:

```js
/*eslint valid-typeof: "error"*/

typeof foo === "strnig"
typeof foo == "undefimed"
typeof bar != "nunber"
typeof bar !== "fucntion"
```

Examples of **correct** code for this rule:

```js
/*eslint valid-typeof: "error"*/

typeof foo === "string"
typeof bar == "undefined"
typeof foo === baz
typeof bar === typeof qux
```

Examples of **incorrect** code with the `{ "requireStringLiterals": true }` option:

```js
typeof foo === undefined
typeof bar == Object
typeof baz === "strnig"
typeof qux === "some invalid type"
typeof baz === anotherVariable
typeof foo == 5
```

Examples of **correct** code with the `{ "requireStringLiterals": true }` option:

```js
typeof foo === "undefined"
typeof bar == "object"
typeof baz === "string"
typeof bar === typeof qux
```

## When Not To Use It

You may want to turn this rule off if you will be using the `typeof` operator on host objects.
