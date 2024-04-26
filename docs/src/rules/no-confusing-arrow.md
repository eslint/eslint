---
title: no-confusing-arrow
rule_type: suggestion
related_rules:
- no-constant-condition
- arrow-parens
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/no-confusing-arrow) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Arrow functions (`=>`) are similar in syntax to some comparison operators (`>`, `<`, `<=`, and `>=`). This rule warns against using the arrow function syntax in places where it could be confused with a comparison operator.

Here's an example where the usage of `=>` could be confusing:

```js
// The intent is not clear
var x = a => 1 ? 2 : 3;
// Did the author mean this
var x = function (a) {
    return 1 ? 2 : 3;
};
// Or this
var x = a <= 1 ? 2 : 3;
```

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-confusing-arrow: "error"*/

var x = a => 1 ? 2 : 3;
var x = (a) => 1 ? 2 : 3;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-confusing-arrow: "error"*/

var x = a => (1 ? 2 : 3);
var x = (a) => (1 ? 2 : 3);
var x = (a) => {
    return 1 ? 2 : 3;
};
var x = a => { return 1 ? 2 : 3; };
```

:::

## Options

This rule accepts two options argument with the following defaults:

```json
{
    "rules": {
        "no-confusing-arrow": [
            "error",
            { "allowParens": true, "onlyOneSimpleParam": false }
        ]
    }
}
```

`allowParens` is a boolean setting that can be `true`(default) or `false`:

1. `true` relaxes the rule and accepts parenthesis as a valid "confusion-preventing" syntax.
2. `false` warns even if the expression is wrapped in parenthesis

Examples of **incorrect** code for this rule with the `{"allowParens": false}` option:

::: incorrect

```js
/*eslint no-confusing-arrow: ["error", {"allowParens": false}]*/

var x = a => (1 ? 2 : 3);
var x = (a) => (1 ? 2 : 3);
```

:::

`onlyOneSimpleParam` is a boolean setting that can be `true` or `false`(default):

1. `true` relaxes the rule and doesn't report errors if the arrow function has 0 or more than 1 parameters, or the parameter is not an identifier.
2. `false` warns regardless of parameters.

Examples of **correct** code for this rule with the `{"onlyOneSimpleParam": true}` option:

::: correct

```js
/*eslint no-confusing-arrow: ["error", {"onlyOneSimpleParam": true}]*/

() => 1 ? 2 : 3;
(a, b) => 1 ? 2 : 3;
(a = b) => 1 ? 2 : 3;
({ a }) => 1 ? 2 : 3;
([a]) => 1 ? 2 : 3;
(...a) => 1 ? 2 : 3;
```

:::
