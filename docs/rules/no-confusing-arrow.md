# Disallow arrow functions where they could be confused with comparisons (no-confusing-arrow)

Arrow functions (`=>`) are similar in syntax to some comparison operators (`>`, `<`, `<=`, and `>=`). This rule warns against using the arrow function syntax in places where it could be confused with a comparison operator. Even if the arguments of the arrow function are wrapped with parens, this rule still warns about it unless `allowParens` is set to `true`.

Here's an example where the usage of `=>` could be confusing:

```js
// The intent is not clear
var x = a => 1 ? 2 : 3;
// Did the author mean this
var x = function (a) { return 1 ? 2 : 3 };
// Or this
var x = a <= 1 ? 2 : 3;
```

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint no-confusing-arrow: "error"*/
/*eslint-env es6*/

var x = a => 1 ? 2 : 3;
var x = (a) => 1 ? 2 : 3;
var x = (a) => (1 ? 2 : 3);
```

Examples of **correct** code for this rule:

```js
/*eslint no-confusing-arrow: "error"*/
/*eslint-env es6*/

var x = a => { return 1 ? 2 : 3; };
var x = (a) => { return 1 ? 2 : 3; };
```

## Options

This rule accepts a single options argument with the following defaults:

```json
{
    "rules": {
        "no-confusing-arrow": ["error", {"allowParens": false}]
    }
}
```

`allowParens` is a boolean setting that can be `true` or `false`:

1. `true` relaxes the rule and accepts parenthesis as a valid "confusion-preventing" syntax.
2. `false` warns even if the expression is wrapped in parenthesis

Examples of **correct** code for this rule with the `{"allowParens": true}` option:

```js
/*eslint no-confusing-arrow: ["error", {"allowParens": true}]*/
/*eslint-env es6*/
var x = a => (1 ? 2 : 3);
var x = (a) => (1 ? 2 : 3);
```

## Related Rules

* [no-constant-condition](no-constant-condition.md)
* [arrow-parens](arrow-parens.md)
