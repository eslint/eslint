# Ensures that the results of typeof are compared against a valid string (valid-typeof)

For a vast majority of use-cases, the only valid results of the `typeof` operator will be one of the following: `"undefined"`, `"object"`, `"boolean"`, `"number"`, `"string"`, `"function"` and `"symbol"`. When the result of a `typeof` operation is compared against a string that is not one of these strings, it is usually a typo. This rule ensures that when the result of a `typeof` operation is compared against a string, that string is in the aforementioned set.

## Rule Details

This rule aims to prevent errors from likely typos by ensuring that when the result of a `typeof` operation is compared against a string, that the string is a valid value.

The following patterns are considered problems:

```js
/*eslint valid-typeof: 2*/

typeof foo === "strnig"
typeof foo == "undefimed"
typeof bar != "nunber"
typeof bar !== "fucntion"
```

The following patterns are not considered problems:

```js
/*eslint valid-typeof: 2*/

typeof foo === "string"
typeof bar == "undefined"
typeof foo === baz
typeof bar === typeof qux
```

## When Not To Use It

You may want to turn this rule off if you will be using the `typeof` operator on host objects.
